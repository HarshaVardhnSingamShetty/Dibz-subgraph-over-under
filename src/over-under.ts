import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  OverAndUnderBetPlaced,
  OverAndUnderGameDrawRevertBets,
  OverAndUnderGameCreated,
  OverAndUnderGameWinAmountSent,
  OverAndUnderRewardsDistributed,
  OverAndUnderOddsUpdated,
  OverAndUnderBetLost,
  OverAndUnderResultsUpdated,
  OverAndUnderFundsSentToTreasury,
  OverAndUnderReceivedBNB,
} from "../generated/OverUnder/OverUnder";
import {
  OverAndUnderBetter,
  OverAndUnderBet,
  OverAndUnderGame,
  TotalOverAndUnderDetail,
  OverAndUnderFund,
  StockInfo,
} from "../generated/schema";

export function handleOverAndUnderGameCreated(
  event: OverAndUnderGameCreated
): void {
  //let id = event.transaction.hash
  let totalOAUDetails = TotalOverAndUnderDetail.load("1");
  if (!totalOAUDetails) {
    totalOAUDetails = new TotalOverAndUnderDetail("1");
    totalOAUDetails.totalNumOfGames = BigInt.fromI32(0);
    totalOAUDetails.totalBetAmountWagered = BigInt.fromI32(0);
    totalOAUDetails.totalRewardsDistributed = BigInt.fromI32(0);
  }
  totalOAUDetails.totalNumOfGames = totalOAUDetails.totalNumOfGames.plus(
    BigInt.fromI32(1)
  );
  totalOAUDetails.save();

  let stock1 = StockInfo.load(event.params.stockSymbol);
  let stock2 = StockInfo.load(event.params.stockSymbol);
  if (!stock1) {
    stock1 = new StockInfo(event.params.stockSymbol);
    stock1.stockId = event.params.stock;
    stock1.stockSymbol = event.params.stockSymbol;
    stock1.numOfGames = BigInt.fromI32(1);
  } else {
    stock1.numOfGames = stock1.numOfGames.plus(BigInt.fromI32(1));
  }
  stock1.save();
  if (!stock2) {
    stock2 = new StockInfo(event.params.stockSymbol);
    stock2.stockId = event.params.stock;
    stock2.stockSymbol = event.params.stockSymbol;
    stock2.numOfGames = BigInt.fromI32(1);
  } else {
    stock2.numOfGames = stock2.numOfGames.plus(BigInt.fromI32(1));
  }
  stock2.save();

  let ouGame = new OverAndUnderGame(event.params.gameId.toHexString());
  ouGame.gameId = event.params.gameId;
  const encodedData = event.params.params;
  const decodedData = ethereum.decode(
    "(uint256,uint256,uint256,uint256,uint256,uint256,uint256)",
    encodedData
  );
  if (decodedData) {
    const data = decodedData.toTuple();
    ouGame.startGameTimestamp = data[3].toBigInt();
    ouGame.endGameTimestamp = data[4].toBigInt();
    ouGame.minBet = data[5].toBigInt();
    ouGame.maxBet = data[6].toBigInt();
    ouGame.initialMultiplier = data[1].toBigInt();
    ouGame.updateMulAfterAmountInWei = data[2].toBigInt();
    ouGame.curUpdateMulAtAmountInWei = ouGame.updateMulAfterAmountInWei;
    ouGame.isGameDraw = false;
    ouGame.stockId = event.params.stock;
    ouGame.stockSymbol = event.params.stockSymbol;
    ouGame.predictPrice = data[0].toBigInt();
    ouGame.rewardsDistributed = false;
    ouGame.winners = [];
    ouGame.totalBetAmountPooled = BigInt.fromI32(0);
    ouGame.totalNumberOfBets = BigInt.fromI32(0);
    ouGame.individualBetsInOverUnder = [BigInt.fromI32(0), BigInt.fromI32(0)];
    ouGame.curMultiplierForOverUnder = [data[1].toBigInt(), data[1].toBigInt()];
  }

  //save entity
  ouGame.save();
}
export function handleOverAndUnderBetPlaced(
  event: OverAndUnderBetPlaced
): void {
  let betId =
    event.params.gameId.toHexString() +
    event.params.better.toHexString() +
    event.params.index.toHexString();

  let ouGame = OverAndUnderGame.load(event.params.gameId.toHexString());

  let ouBet = new OverAndUnderBet(betId);
  ouBet.gameId = event.params.gameId;
  ouBet.timestamp = event.block.timestamp;
  if (ouGame) {
    ouBet.startGameTimestamp = ouGame.startGameTimestamp;
  }
  ouBet.isDraw = false;
  ouBet.better = event.params.better;
  ouBet.index = event.params.index;
  ouBet.betAmount = event.params.betAmount;
  ouBet.multiplier = event.params.multiplier;
  ouBet.predictAsOver = event.params.predictPriceAsOver;
  ouBet.bet = ouGame!.id;
  ouBet.save();

  if (ouGame) {
    ouGame.totalBetAmountPooled = ouGame.totalBetAmountPooled.plus(
      event.params.betAmount
    );
    ouGame.curUpdateMulAtAmountInWei = event.params.curUpdateMulAtAmountInWei;
    ouGame.totalNumberOfBets = ouGame.totalNumberOfBets.plus(BigInt.fromI32(1));
    if (event.params.predictPriceAsOver) {
      let curBetsInOver = ouGame.individualBetsInOverUnder[0].plus(
        event.params.betAmount
      );
      let curBetsInUnder = ouGame.individualBetsInOverUnder[1];
      let curBets = [curBetsInOver, curBetsInUnder];
      ouGame.individualBetsInOverUnder = curBets;
    } else {
      let curBetsInOver = ouGame.individualBetsInOverUnder[0];
      let curBetsInUnder = ouGame.individualBetsInOverUnder[1].plus(
        event.params.betAmount
      );
      let curBets = [curBetsInOver, curBetsInUnder];

      ouGame.individualBetsInOverUnder = curBets;
    }
    ouGame.save();
  }

  let ouBetter = OverAndUnderBetter.load(event.params.better.toHexString());
  if (ouBetter) {
    if (!ouBetter.gameIds.includes(event.params.gameId)) {
      let gameIds = ouBetter.gameIds;
      gameIds.push(event.params.gameId);
      ouBetter.gameIds = gameIds;
    }
    ouBetter.totalBetAmount = ouBetter.totalBetAmount.plus(
      event.params.betAmount
    );
  } else {
    ouBetter = new OverAndUnderBetter(event.params.better.toHexString());
    ouBetter.address = event.params.better;
    ouBetter.gameIds = [event.params.gameId];
    ouBetter.totalBetAmount = event.params.betAmount;
    ouBetter.totalWinAmont = BigInt.fromI32(0);
  }
  ouBetter.save();

  let totalOAUDetails = TotalOverAndUnderDetail.load("1");
  if (totalOAUDetails) {
    totalOAUDetails.totalBetAmountWagered = totalOAUDetails.totalBetAmountWagered.plus(
      event.params.betAmount
    );
    totalOAUDetails.save();
  }
}

export function handleOverAndUnderOddsUpdated(
  event: OverAndUnderOddsUpdated
): void {
  let ouGame = OverAndUnderGame.load(event.params.gameId.toHexString());
  if (ouGame) {
    let newOdds = [event.params.newOddsStock0, event.params.newOddsStock1];
    ouGame.curMultiplierForOverUnder = newOdds;
    ouGame.save();
  }
}

export function handleOverAndUnderResultsUpdated(
  event: OverAndUnderResultsUpdated
): void {
  let ouGame = OverAndUnderGame.load(event.params.gameId.toHexString());

  if (ouGame) {
    ouGame.finalPrice = event.params.finalPrice;
    ouGame.finalResult = event.params.finalResult;
    ouGame.resultsUpdatedAsDraw = event.params.isDraw;
    ouGame.save();
  }
}

export function handleOverAndUnderGameDrawRevertBets(
  event: OverAndUnderGameDrawRevertBets
): void {
  let ouGame = OverAndUnderGame.load(event.params.gameId.toHexString());
  if (ouGame) {
    ouGame.isGameDraw = true;
    ouGame.save();
  }
  let id =
    event.params.gameId.toHexString() +
    event.params.better.toHexString() +
    event.params.index.toHexString();
  let ouBet = OverAndUnderBet.load(id);
  if (ouBet) {
    ouBet.isDraw = true;
    ouBet.save();
  }
}

export function handleOverAndUnderGameWinAmountSent(
  event: OverAndUnderGameWinAmountSent
): void {
  let id =
    event.params.gameId.toHexString() +
    event.params.winner.toHexString() +
    event.params.index.toHexString();
  let ouBet = OverAndUnderBet.load(id);

  if (ouBet) {
    ouBet.winAmount = event.params.amountSent;
    ouBet.win = true;
    ouBet.save();
  }

  let ouBetter = OverAndUnderBetter.load(event.params.winner.toHexString());
  if (ouBetter) {
    if (ouBetter.totalWinAmont) {
      ouBetter.totalWinAmont = ouBetter.totalWinAmont.plus(
        event.params.amountSent
      );
    } else {
      ouBetter.totalWinAmont = event.params.amountSent;
    }

    ouBetter.save();
  }

  let ouGame = OverAndUnderGame.load(event.params.gameId.toHexString());
  if (ouGame && ouGame.winners.indexOf(event.params.winner) === -1) {
    if (!ouGame.winners.includes(event.params.winner)) {
      let gameWinners = ouGame.winners;
      gameWinners.push(event.params.winner);
      ouGame.winners = gameWinners;
      ouGame.save();
    }
  }

  let totalOAUDetails = TotalOverAndUnderDetail.load("1");
  if (totalOAUDetails) {
    totalOAUDetails.totalRewardsDistributed = totalOAUDetails.totalRewardsDistributed.plus(
      event.params.amountSent
    );
    totalOAUDetails.save();
  }
}

export function handleOverAndUnderRewardsDistributed(
  event: OverAndUnderRewardsDistributed
): void {
  let ouGame = OverAndUnderGame.load(event.params.gameId.toHexString());
  if (ouGame) {
    ouGame.rewardsDistributed = true;
    ouGame.save();
  }
}

export function handleOverAndUnderBetLost(event: OverAndUnderBetLost): void {
  let id =
    event.params.gameId.toHexString() +
    event.params.better.toHexString() +
    event.params.index.toHexString();
  let ouBet = OverAndUnderBet.load(id);

  if (ouBet) {
    ouBet.win = false;
    ouBet.winAmount = BigInt.fromI32(0);
    ouBet.save();
  }
}
export function handleOverAndUnderReceivedBNB(
  event: OverAndUnderReceivedBNB
): void {
  let h2hFunds = OverAndUnderFund.load("1");
  if (!h2hFunds) {
    h2hFunds = new OverAndUnderFund("1");
    h2hFunds.totalFundsReceivedFromTreasury = event.params.value;
    h2hFunds.totalFundsSentToTreasury = BigInt.fromI32(0);
  }
  h2hFunds.totalFundsReceivedFromTreasury = h2hFunds.totalFundsReceivedFromTreasury.plus(
    event.params.value
  );
  h2hFunds.save();
}

export function handleOverAndUnderFundsSentToTreasury(
  event: OverAndUnderFundsSentToTreasury
): void {
  let h2hFunds = OverAndUnderFund.load("1");
  if (!h2hFunds) {
    h2hFunds = new OverAndUnderFund("1");
    h2hFunds.totalFundsSentToTreasury = event.params.amount;
    h2hFunds.totalFundsReceivedFromTreasury = BigInt.fromI32(0);
    h2hFunds.save();
  }
  h2hFunds.totalFundsSentToTreasury = h2hFunds.totalFundsSentToTreasury.plus(
    event.params.amount
  );
  h2hFunds.save();
}

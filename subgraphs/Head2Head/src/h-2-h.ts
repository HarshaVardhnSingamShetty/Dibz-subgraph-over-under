import { BigInt } from "@graphprotocol/graph-ts";

import {
  Head2HeadBetPlaced,
  Head2HeadGameDrawRevertBets,
  Head2HeadGameCreated,
  Head2HeadGameWinAmountSent,
  Head2HeadPricesUpdated,
  Head2HeadWinningStockUpdated,
  Head2HeadRewardsDistributed,
  Head2HeadOddsUpdated,
  Head2HeadBetLost,
  Head2HeadReceivedBNB,
  Head2HeadFundsSentToTreasury,
} from "../generated/h2h/h2h";
import {
  Better,
  Head2HeadBet,
  Head2HeadFund,
  Head2HeadGame,
  StockInfo,
  TotalH2HDetail,
} from "../generated/schema";

export function handleHead2HeadGameCreated(event: Head2HeadGameCreated): void {
  //let id = event.transaction.hash
  let totalH2HDetails = TotalH2HDetail.load("1");
  if (!totalH2HDetails) {
    totalH2HDetails = new TotalH2HDetail("1");
    totalH2HDetails.totalNumOfGames = BigInt.fromI32(0);
    totalH2HDetails.totalBetAmountWagered = BigInt.fromI32(0);
    totalH2HDetails.totalRewardsDistributed = BigInt.fromI32(0);
  }
  let stock1 = StockInfo.load(event.params.stockSymbols[0]);
  let stock2 = StockInfo.load(event.params.stockSymbols[1]);
  if (!stock1) {
    stock1 = new StockInfo(event.params.stockSymbols[0]);
    stock1.stockId = event.params.stocks[0];
    stock1.stockSymbol = event.params.stockSymbols[0];
    stock1.numOfGames = BigInt.fromI32(1);
  } else {
    stock1.numOfGames = stock1.numOfGames.plus(BigInt.fromI32(1));
  }
  stock1.save();
  if (!stock2) {
    stock2 = new StockInfo(event.params.stockSymbols[1]);
    stock2.stockId = event.params.stocks[1];
    stock2.stockSymbol = event.params.stockSymbols[1];
    stock2.numOfGames = BigInt.fromI32(1);
  } else {
    stock2.numOfGames = stock2.numOfGames.plus(BigInt.fromI32(1));
  }
  stock2.save();

  let h2hGame = new Head2HeadGame(event.params.gameId.toHexString());
  h2hGame.gameId = event.params.gameId;
  h2hGame.startGameTimestamp = event.params.startGameTimestamp;
  h2hGame.endGameTimestamp = event.params.endGameTimeStamp;
  h2hGame.minBet = event.params.minBetAmountInWei;
  h2hGame.maxBet = event.params.maxBetAmountInWei;
  h2hGame.initialMultiplier = event.params.initialMultiplierInWei;
  h2hGame.updateMulAfterAmountInWei = event.params.updateMulAfterAmountInWei;
  h2hGame.curUpdateMulAtAmountInWei = event.params.updateMulAfterAmountInWei;
  h2hGame.isGameDraw = false;
  h2hGame.stockIds = event.params.stocks;
  h2hGame.stockSymbols = event.params.stockSymbols;
  h2hGame.rewardsDistributed = false;
  h2hGame.winners = [];
  h2hGame.totalBetAmountPooled = BigInt.fromI32(0);
  h2hGame.totalNumberOfBets = BigInt.fromI32(0);
  h2hGame.totalBetAmountsInStocks = [BigInt.fromI32(0), BigInt.fromI32(0)];
  h2hGame.curMultiplierOfStocks = [
    event.params.initialMultiplierInWei,
    event.params.initialMultiplierInWei,
  ];
  //save entity
  h2hGame.save();

  totalH2HDetails.totalNumOfGames = totalH2HDetails.totalNumOfGames.plus(
    BigInt.fromI32(1)
  );
  totalH2HDetails.save();
}
export function handleHead2HeadBetPlaced(event: Head2HeadBetPlaced): void {
  let betId =
    event.params.gameId.toHexString() +
    event.params.better.toHexString() +
    event.params.index.toHexString();

  let h2hGame = Head2HeadGame.load(event.params.gameId.toHexString());

  let h2hBet = new Head2HeadBet(betId);
  h2hBet.gameId = event.params.gameId;
  h2hBet.timestamp = event.block.timestamp;
  if (h2hGame) {
    h2hBet.startGameTimestamp = h2hGame.startGameTimestamp;
  }
  h2hBet.isDraw = false;
  h2hBet.better = event.params.better;
  h2hBet.index = event.params.index;
  h2hBet.betAmount = event.params.betAmount;
  h2hBet.multiplier = event.params.multiplier;
  h2hBet.stockId = event.params.stockId;
  h2hBet.bet = h2hGame!.id;
  h2hBet.save();

  if (h2hGame) {
    h2hGame.totalBetAmountPooled = h2hGame.totalBetAmountPooled.plus(
      event.params.betAmount
    );
    h2hGame.curUpdateMulAtAmountInWei = event.params.curUpdateMulAtAmountInWei;
    h2hGame.totalNumberOfBets = h2hGame.totalNumberOfBets.plus(
      BigInt.fromI32(1)
    );
    if (event.params.stockId == h2hGame.stockIds[0]) {
      // if(h2hGame.totalBetAmountsInStocks)
      let curBetsInStock0 = h2hGame.totalBetAmountsInStocks[0].plus(
        event.params.betAmount
      );
      let curBetsInStock1 = h2hGame.totalBetAmountsInStocks[1];
      let curBets = [curBetsInStock0, curBetsInStock1];
      h2hGame.totalBetAmountsInStocks = curBets;
    } else {
      let curBetsInStock0 = h2hGame.totalBetAmountsInStocks[0];
      let curBetsInStock1 = h2hGame.totalBetAmountsInStocks[1].plus(
        event.params.betAmount
      );
      let curBets = [curBetsInStock0, curBetsInStock1];
      h2hGame.totalBetAmountsInStocks = curBets;
    }
    h2hGame.save();
  }

  let h2hBetter = Better.load(event.params.better.toHexString());
  if (h2hBetter) {
    if (!h2hBetter.gameIds.includes(event.params.gameId)) {
      let gameIds = h2hBetter.gameIds;
      gameIds.push(event.params.gameId);
      h2hBetter.gameIds = gameIds;
    }
    h2hBetter.totalBetAmount = h2hBetter.totalBetAmount.plus(
      event.params.betAmount
    );
  } else {
    h2hBetter = new Better(event.params.better.toHexString());
    h2hBetter.address = event.params.better;
    h2hBetter.gameIds = [event.params.gameId];
    h2hBetter.totalBetAmount = event.params.betAmount;
    h2hBetter.totalWinAmont = BigInt.fromI32(0);
  }
  h2hBetter.save();

  let totalH2HDetails = TotalH2HDetail.load("1");
  if (totalH2HDetails) {
    totalH2HDetails.totalBetAmountWagered = totalH2HDetails.totalBetAmountWagered.plus(
      event.params.betAmount
    );
    totalH2HDetails.save();
  }
}

export function handleHead2HeadOddsUpdated(event: Head2HeadOddsUpdated): void {
  let h2hGame = Head2HeadGame.load(event.params.gameId.toHexString());
  if (h2hGame) {
    let newOdds = [event.params.newOddsStock0, event.params.newOddsStock1];
    h2hGame.curMultiplierOfStocks = newOdds;
    // h2hGame.curMultiplierOfStocks[0] = event.params.newOddsStock0;
    // h2hGame.curMultiplierOfStocks[1] = event.params.newOddsStock1;
    h2hGame.save();
  }
}

export function handleHead2HeadPricesUpdated(
  event: Head2HeadPricesUpdated
): void {
  let h2hGame = Head2HeadGame.load(event.params.gameId.toHexString());

  if (h2hGame) {
    h2hGame.startGameStockPrices = event.params.startGameStockPricesInWei;
    h2hGame.endGameStockPrices = event.params.endGameStockPricesInWei;

    h2hGame.save();
  }
}

export function handleHead2HeadWinningStockUpdated(
  event: Head2HeadWinningStockUpdated
): void {
  let h2hGame = Head2HeadGame.load(event.params.gameId.toHexString());
  if (h2hGame) {
    h2hGame.winningStockId = event.params.winningStockId;
    h2hGame.save();
  }
}

export function handleHead2HeadGameDrawRevertBets(
  event: Head2HeadGameDrawRevertBets
): void {
  let h2hGame = Head2HeadGame.load(event.params.gameId.toHexString());
  if (h2hGame) {
    h2hGame.isGameDraw = true;
    h2hGame.save();
  }
  let id =
    event.params.gameId.toHexString() +
    event.params.better.toHexString() +
    event.params.index.toHexString();
  let h2hBet = Head2HeadBet.load(id);
  if (h2hBet) {
    h2hBet.isDraw = true;
    h2hBet.save();
  }
}

export function handleHead2HeadGameWinAmountSent(
  event: Head2HeadGameWinAmountSent
): void {
  let id =
    event.params.gameId.toHexString() +
    event.params.winner.toHexString() +
    event.params.index.toHexString();
  let h2hBet = Head2HeadBet.load(id);

  if (h2hBet) {
    h2hBet.winAmount = event.params.amountSent;
    h2hBet.win = true;
    h2hBet.save();
  }

  let h2hBetter = Better.load(event.params.winner.toHexString());
  if (h2hBetter) {
    if (h2hBetter.totalWinAmont) {
      h2hBetter.totalWinAmont = h2hBetter.totalWinAmont.plus(
        event.params.amountSent
      );
    } else {
      h2hBetter.totalWinAmont = event.params.amountSent;
    }

    h2hBetter.save();
  }

  let h2hGame = Head2HeadGame.load(event.params.gameId.toHexString());
  if (h2hGame && h2hGame.winners.indexOf(event.params.winner) === -1) {
    if (!h2hGame.winners.includes(event.params.winner)) {
      let gameWinners = h2hGame.winners;
      gameWinners.push(event.params.winner);
      h2hGame.winners = gameWinners;
      h2hGame.save();
    }
  }

  let totalH2HDetails = TotalH2HDetail.load("1");
  if (totalH2HDetails) {
    totalH2HDetails.totalRewardsDistributed = totalH2HDetails.totalRewardsDistributed.plus(
      event.params.amountSent
    );
    totalH2HDetails.save();
  }
}

export function handleHead2HeadRewardsDistributed(
  event: Head2HeadRewardsDistributed
): void {
  let h2hGame = Head2HeadGame.load(event.params.gameId.toHexString());
  if (h2hGame) {
    h2hGame.rewardsDistributed = true;
    h2hGame.save();
  }
}

export function handleHead2HeadBetLost(event: Head2HeadBetLost): void {
  let id =
    event.params.gameId.toHexString() +
    event.params.better.toHexString() +
    event.params.index.toHexString();
  let h2hBet = Head2HeadBet.load(id);

  if (h2hBet) {
    h2hBet.win = false;
    h2hBet.winAmount = BigInt.fromI32(0);
    h2hBet.save();
  }
}

export function handleHead2HeadReceivedBNB(event: Head2HeadReceivedBNB): void {
  let h2hFunds = Head2HeadFund.load("1");
  if (!h2hFunds) {
    h2hFunds = new Head2HeadFund("1");
    h2hFunds.totalFundsReceivedFromTreasury = event.params.value;
    h2hFunds.totalFundsSentToTreasury = BigInt.fromI32(0);
  }
  h2hFunds.totalFundsReceivedFromTreasury = h2hFunds.totalFundsReceivedFromTreasury.plus(
    event.params.value
  );
  h2hFunds.save();
}

export function handleHead2HeadFundsSentToTreasury(
  event: Head2HeadFundsSentToTreasury
): void {
  let h2hFunds = Head2HeadFund.load("1");
  if (!h2hFunds) {
    h2hFunds = new Head2HeadFund("1");
    h2hFunds.totalFundsSentToTreasury = event.params.amount;
    h2hFunds.totalFundsReceivedFromTreasury = BigInt.fromI32(0);
    h2hFunds.save();
  }
  h2hFunds.totalFundsSentToTreasury = h2hFunds.totalFundsSentToTreasury.plus(
    event.params.amount
  );
  h2hFunds.save();
}
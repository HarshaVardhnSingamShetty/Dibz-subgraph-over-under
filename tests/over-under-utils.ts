import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  AdminChanged,
  BeaconUpgraded,
  Initialized,
  OverAndUnderBatchGameIds,
  OverAndUnderBetLost,
  OverAndUnderBetPlaced,
  OverAndUnderFundsSentToTreasury,
  OverAndUnderGameCreated,
  OverAndUnderGameDrawRevertBets,
  OverAndUnderGameWinAmountSent,
  OverAndUnderOddsUpdated,
  OverAndUnderReceivedBNB,
  OverAndUnderResultsUpdated,
  OverAndUnderRewardsDistributed,
  Paused,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Unpaused,
  Upgraded
} from "../generated/OverUnder/OverUnder"

export function createAdminChangedEvent(
  previousAdmin: Address,
  newAdmin: Address
): AdminChanged {
  let adminChangedEvent = changetype<AdminChanged>(newMockEvent())

  adminChangedEvent.parameters = new Array()

  adminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdmin",
      ethereum.Value.fromAddress(previousAdmin)
    )
  )
  adminChangedEvent.parameters.push(
    new ethereum.EventParam("newAdmin", ethereum.Value.fromAddress(newAdmin))
  )

  return adminChangedEvent
}

export function createBeaconUpgradedEvent(beacon: Address): BeaconUpgraded {
  let beaconUpgradedEvent = changetype<BeaconUpgraded>(newMockEvent())

  beaconUpgradedEvent.parameters = new Array()

  beaconUpgradedEvent.parameters.push(
    new ethereum.EventParam("beacon", ethereum.Value.fromAddress(beacon))
  )

  return beaconUpgradedEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createOverAndUnderBatchGameIdsEvent(
  createdGameIds: Array<BigInt>
): OverAndUnderBatchGameIds {
  let overAndUnderBatchGameIdsEvent = changetype<OverAndUnderBatchGameIds>(
    newMockEvent()
  )

  overAndUnderBatchGameIdsEvent.parameters = new Array()

  overAndUnderBatchGameIdsEvent.parameters.push(
    new ethereum.EventParam(
      "createdGameIds",
      ethereum.Value.fromUnsignedBigIntArray(createdGameIds)
    )
  )

  return overAndUnderBatchGameIdsEvent
}

export function createOverAndUnderBetLostEvent(
  gameId: BigInt,
  better: Address,
  index: BigInt,
  predictAsOver: boolean
): OverAndUnderBetLost {
  let overAndUnderBetLostEvent = changetype<OverAndUnderBetLost>(newMockEvent())

  overAndUnderBetLostEvent.parameters = new Array()

  overAndUnderBetLostEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )
  overAndUnderBetLostEvent.parameters.push(
    new ethereum.EventParam("better", ethereum.Value.fromAddress(better))
  )
  overAndUnderBetLostEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  overAndUnderBetLostEvent.parameters.push(
    new ethereum.EventParam(
      "predictAsOver",
      ethereum.Value.fromBoolean(predictAsOver)
    )
  )

  return overAndUnderBetLostEvent
}

export function createOverAndUnderBetPlacedEvent(
  gameId: BigInt,
  better: Address,
  index: BigInt,
  predictPriceAsOver: boolean,
  betAmount: BigInt,
  multiplier: BigInt,
  curUpdateMulAtAmountInWei: BigInt
): OverAndUnderBetPlaced {
  let overAndUnderBetPlacedEvent = changetype<OverAndUnderBetPlaced>(
    newMockEvent()
  )

  overAndUnderBetPlacedEvent.parameters = new Array()

  overAndUnderBetPlacedEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )
  overAndUnderBetPlacedEvent.parameters.push(
    new ethereum.EventParam("better", ethereum.Value.fromAddress(better))
  )
  overAndUnderBetPlacedEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  overAndUnderBetPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "predictPriceAsOver",
      ethereum.Value.fromBoolean(predictPriceAsOver)
    )
  )
  overAndUnderBetPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "betAmount",
      ethereum.Value.fromUnsignedBigInt(betAmount)
    )
  )
  overAndUnderBetPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "multiplier",
      ethereum.Value.fromUnsignedBigInt(multiplier)
    )
  )
  overAndUnderBetPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "curUpdateMulAtAmountInWei",
      ethereum.Value.fromUnsignedBigInt(curUpdateMulAtAmountInWei)
    )
  )

  return overAndUnderBetPlacedEvent
}

export function createOverAndUnderFundsSentToTreasuryEvent(
  amount: BigInt
): OverAndUnderFundsSentToTreasury {
  let overAndUnderFundsSentToTreasuryEvent = changetype<
    OverAndUnderFundsSentToTreasury
  >(newMockEvent())

  overAndUnderFundsSentToTreasuryEvent.parameters = new Array()

  overAndUnderFundsSentToTreasuryEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return overAndUnderFundsSentToTreasuryEvent
}

export function createOverAndUnderGameCreatedEvent(
  gameId: BigInt,
  stock: Bytes,
  stockSymbol: string,
  initialMultiplierInWei: BigInt,
  updateMulAfterAmountInWei: BigInt,
  startGameTimestamp: BigInt,
  endGameTimeStamp: BigInt,
  minBetAmountInWei: BigInt,
  maxBetAmountInWei: BigInt
): OverAndUnderGameCreated {
  let overAndUnderGameCreatedEvent = changetype<OverAndUnderGameCreated>(
    newMockEvent()
  )

  overAndUnderGameCreatedEvent.parameters = new Array()

  overAndUnderGameCreatedEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )
  overAndUnderGameCreatedEvent.parameters.push(
    new ethereum.EventParam("stock", ethereum.Value.fromFixedBytes(stock))
  )
  overAndUnderGameCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "stockSymbol",
      ethereum.Value.fromString(stockSymbol)
    )
  )
  overAndUnderGameCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "initialMultiplierInWei",
      ethereum.Value.fromUnsignedBigInt(initialMultiplierInWei)
    )
  )
  overAndUnderGameCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "updateMulAfterAmountInWei",
      ethereum.Value.fromUnsignedBigInt(updateMulAfterAmountInWei)
    )
  )
  overAndUnderGameCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "startGameTimestamp",
      ethereum.Value.fromUnsignedBigInt(startGameTimestamp)
    )
  )
  overAndUnderGameCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endGameTimeStamp",
      ethereum.Value.fromUnsignedBigInt(endGameTimeStamp)
    )
  )
  overAndUnderGameCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "minBetAmountInWei",
      ethereum.Value.fromUnsignedBigInt(minBetAmountInWei)
    )
  )
  overAndUnderGameCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "maxBetAmountInWei",
      ethereum.Value.fromUnsignedBigInt(maxBetAmountInWei)
    )
  )

  return overAndUnderGameCreatedEvent
}

export function createOverAndUnderGameDrawRevertBetsEvent(
  gameId: BigInt,
  better: Address,
  index: BigInt,
  predictPriceAsOver: boolean,
  betAmt: BigInt
): OverAndUnderGameDrawRevertBets {
  let overAndUnderGameDrawRevertBetsEvent = changetype<
    OverAndUnderGameDrawRevertBets
  >(newMockEvent())

  overAndUnderGameDrawRevertBetsEvent.parameters = new Array()

  overAndUnderGameDrawRevertBetsEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )
  overAndUnderGameDrawRevertBetsEvent.parameters.push(
    new ethereum.EventParam("better", ethereum.Value.fromAddress(better))
  )
  overAndUnderGameDrawRevertBetsEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  overAndUnderGameDrawRevertBetsEvent.parameters.push(
    new ethereum.EventParam(
      "predictPriceAsOver",
      ethereum.Value.fromBoolean(predictPriceAsOver)
    )
  )
  overAndUnderGameDrawRevertBetsEvent.parameters.push(
    new ethereum.EventParam("betAmt", ethereum.Value.fromUnsignedBigInt(betAmt))
  )

  return overAndUnderGameDrawRevertBetsEvent
}

export function createOverAndUnderGameWinAmountSentEvent(
  gameId: BigInt,
  winner: Address,
  index: BigInt,
  finalResult: boolean,
  multiplier: BigInt,
  amountSent: BigInt
): OverAndUnderGameWinAmountSent {
  let overAndUnderGameWinAmountSentEvent = changetype<
    OverAndUnderGameWinAmountSent
  >(newMockEvent())

  overAndUnderGameWinAmountSentEvent.parameters = new Array()

  overAndUnderGameWinAmountSentEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )
  overAndUnderGameWinAmountSentEvent.parameters.push(
    new ethereum.EventParam("winner", ethereum.Value.fromAddress(winner))
  )
  overAndUnderGameWinAmountSentEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  overAndUnderGameWinAmountSentEvent.parameters.push(
    new ethereum.EventParam(
      "finalResult",
      ethereum.Value.fromBoolean(finalResult)
    )
  )
  overAndUnderGameWinAmountSentEvent.parameters.push(
    new ethereum.EventParam(
      "multiplier",
      ethereum.Value.fromUnsignedBigInt(multiplier)
    )
  )
  overAndUnderGameWinAmountSentEvent.parameters.push(
    new ethereum.EventParam(
      "amountSent",
      ethereum.Value.fromUnsignedBigInt(amountSent)
    )
  )

  return overAndUnderGameWinAmountSentEvent
}

export function createOverAndUnderOddsUpdatedEvent(
  gameId: BigInt,
  newOddsStock0: BigInt,
  newOddsStock1: BigInt
): OverAndUnderOddsUpdated {
  let overAndUnderOddsUpdatedEvent = changetype<OverAndUnderOddsUpdated>(
    newMockEvent()
  )

  overAndUnderOddsUpdatedEvent.parameters = new Array()

  overAndUnderOddsUpdatedEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )
  overAndUnderOddsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newOddsStock0",
      ethereum.Value.fromUnsignedBigInt(newOddsStock0)
    )
  )
  overAndUnderOddsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newOddsStock1",
      ethereum.Value.fromUnsignedBigInt(newOddsStock1)
    )
  )

  return overAndUnderOddsUpdatedEvent
}

export function createOverAndUnderReceivedBNBEvent(
  from: Address,
  value: BigInt
): OverAndUnderReceivedBNB {
  let overAndUnderReceivedBnbEvent = changetype<OverAndUnderReceivedBNB>(
    newMockEvent()
  )

  overAndUnderReceivedBnbEvent.parameters = new Array()

  overAndUnderReceivedBnbEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  overAndUnderReceivedBnbEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return overAndUnderReceivedBnbEvent
}

export function createOverAndUnderResultsUpdatedEvent(
  gameId: BigInt,
  finalPrice: BigInt,
  finalResult: boolean,
  isDraw: boolean
): OverAndUnderResultsUpdated {
  let overAndUnderResultsUpdatedEvent = changetype<OverAndUnderResultsUpdated>(
    newMockEvent()
  )

  overAndUnderResultsUpdatedEvent.parameters = new Array()

  overAndUnderResultsUpdatedEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )
  overAndUnderResultsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "finalPrice",
      ethereum.Value.fromUnsignedBigInt(finalPrice)
    )
  )
  overAndUnderResultsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "finalResult",
      ethereum.Value.fromBoolean(finalResult)
    )
  )
  overAndUnderResultsUpdatedEvent.parameters.push(
    new ethereum.EventParam("isDraw", ethereum.Value.fromBoolean(isDraw))
  )

  return overAndUnderResultsUpdatedEvent
}

export function createOverAndUnderRewardsDistributedEvent(
  gameId: BigInt
): OverAndUnderRewardsDistributed {
  let overAndUnderRewardsDistributedEvent = changetype<
    OverAndUnderRewardsDistributed
  >(newMockEvent())

  overAndUnderRewardsDistributedEvent.parameters = new Array()

  overAndUnderRewardsDistributedEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )

  return overAndUnderRewardsDistributedEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}

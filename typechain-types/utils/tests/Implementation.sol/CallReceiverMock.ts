/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export interface CallReceiverMockInterface extends utils.Interface {
  functions: {
    "mockFunction()": FunctionFragment;
    "mockFunctionOutOfGas()": FunctionFragment;
    "mockFunctionRevertsNoReason()": FunctionFragment;
    "mockFunctionRevertsReason()": FunctionFragment;
    "mockFunctionThrows()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "mockFunction"
      | "mockFunctionOutOfGas"
      | "mockFunctionRevertsNoReason"
      | "mockFunctionRevertsReason"
      | "mockFunctionThrows"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "mockFunction",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mockFunctionOutOfGas",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mockFunctionRevertsNoReason",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mockFunctionRevertsReason",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mockFunctionThrows",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "mockFunction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mockFunctionOutOfGas",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mockFunctionRevertsNoReason",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mockFunctionRevertsReason",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mockFunctionThrows",
    data: BytesLike
  ): Result;

  events: {
    "MockFunctionCalled()": EventFragment;
    "MockFunctionCalledWithArgs(uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "MockFunctionCalled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MockFunctionCalledWithArgs"): EventFragment;
}

export interface MockFunctionCalledEventObject {}
export type MockFunctionCalledEvent = TypedEvent<
  [],
  MockFunctionCalledEventObject
>;

export type MockFunctionCalledEventFilter =
  TypedEventFilter<MockFunctionCalledEvent>;

export interface MockFunctionCalledWithArgsEventObject {
  a: BigNumber;
  b: BigNumber;
}
export type MockFunctionCalledWithArgsEvent = TypedEvent<
  [BigNumber, BigNumber],
  MockFunctionCalledWithArgsEventObject
>;

export type MockFunctionCalledWithArgsEventFilter =
  TypedEventFilter<MockFunctionCalledWithArgsEvent>;

export interface CallReceiverMock extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CallReceiverMockInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    mockFunction(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    mockFunctionOutOfGas(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    mockFunctionRevertsNoReason(overrides?: CallOverrides): Promise<[string]>;

    mockFunctionRevertsReason(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    mockFunctionThrows(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  mockFunction(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  mockFunctionOutOfGas(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  mockFunctionRevertsNoReason(overrides?: CallOverrides): Promise<string>;

  mockFunctionRevertsReason(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  mockFunctionThrows(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    mockFunction(overrides?: CallOverrides): Promise<string>;

    mockFunctionOutOfGas(overrides?: CallOverrides): Promise<void>;

    mockFunctionRevertsNoReason(overrides?: CallOverrides): Promise<string>;

    mockFunctionRevertsReason(overrides?: CallOverrides): Promise<void>;

    mockFunctionThrows(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "MockFunctionCalled()"(): MockFunctionCalledEventFilter;
    MockFunctionCalled(): MockFunctionCalledEventFilter;

    "MockFunctionCalledWithArgs(uint256,uint256)"(
      a?: null,
      b?: null
    ): MockFunctionCalledWithArgsEventFilter;
    MockFunctionCalledWithArgs(
      a?: null,
      b?: null
    ): MockFunctionCalledWithArgsEventFilter;
  };

  estimateGas: {
    mockFunction(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    mockFunctionOutOfGas(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    mockFunctionRevertsNoReason(overrides?: CallOverrides): Promise<BigNumber>;

    mockFunctionRevertsReason(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    mockFunctionThrows(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    mockFunction(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    mockFunctionOutOfGas(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    mockFunctionRevertsNoReason(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mockFunctionRevertsReason(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    mockFunctionThrows(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}

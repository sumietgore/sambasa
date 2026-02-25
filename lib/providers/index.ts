import { ChatModel } from "openai/resources/chat/chat.mjs";
import { Model } from "@anthropic-ai/sdk/resources";

export type ModelProviders = "openai" | "anthropic" | (string & {});
export type AllModels = ChatModel | Model;

export type ModelLabelMap = {
  [key in AllModels]?: string;
};

export type ProviderLabelMap = {
  [key in ModelProviders]: string;
};

export type ProvideModelMap = {
  [key in ModelProviders]: ModelLabelMap;
};

export const ProviderLabels: ProviderLabelMap = {
  openai: "OpenAI",
  anthropic: "Anthropic",
};

export const AvailableOpenAIModels: ModelLabelMap = {
  "gpt-5.2": "GPT 5.2",
  "gpt-5.1": "GPT 5.1",
  "gpt-4.1-mini": "GPT 4.1 Mini",
  "gpt-4.0-mini": "GPT 4.0 Mini",
};

export const AvailableAnthropicModels: ModelLabelMap = {
  "claude-haiku-4-5": "Haiku 4.5",
  "claude-sonnet-4-6": "Sonnet 4.6",
  "claude-opus-4-6": "Opus 4.6",
  "claude-sonnet-4-5": "Sonnet 4.5",
  "claude-opus-4-5": "Opus 4.5",
};

export const AvailableModels: ProvideModelMap = {
  openai: AvailableOpenAIModels,
  anthropic: AvailableAnthropicModels,
};

import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  AllModels,
  ModelProviders,
  ProviderLabels,
  AvailableModels,
} from "@/lib/providers";
import { Dispatch, SetStateAction } from "react";

export default function ModelSelector(props: {
  model: AllModels;
  setModel: Dispatch<SetStateAction<AllModels>>;
  provider: ModelProviders;
  setProvider: Dispatch<SetStateAction<ModelProviders>>;
  isStreaming: boolean;
}) {
  const { model, setModel, provider, setProvider, isStreaming } = props;

  function handleModelChange(model: AllModels, provider: ModelProviders) {
    setModel(model);
    setProvider(provider);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="" disabled={isStreaming}>
          {ProviderLabels[provider]}
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48">
        <DropdownMenuGroup>
          {Object.keys(AvailableModels).map((key) => (
            <DropdownMenuSub key={key}>
              <DropdownMenuSubTrigger>
                {ProviderLabels[key]}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="min-w-48">
                  {Object.keys(AvailableModels[key]).map((modelKey) => (
                    <DropdownMenuCheckboxItem
                      key={modelKey}
                      onClick={() => handleModelChange(modelKey, key)}
                      checked={modelKey === model}
                    >
                      {AvailableModels[key][modelKey]}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

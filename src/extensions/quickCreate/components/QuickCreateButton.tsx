import * as React from "react";
import {
  IContextualMenuItem,
  IContextualMenuProps,
  IIconProps,
} from "@fluentui/react";
import { CommandButton } from "@fluentui/react/lib/components/Button/CommandButton/CommandButton";
import { ListItemService } from "../../../services/ListService";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";

const QuickCreateButton: React.FC<{ context: ApplicationCustomizerContext }> = (
  props
) => {
  const [menu, setMenu] = React.useState<IContextualMenuProps>();
  const listService = ListItemService(props.context);

  const setIconName = (baseTemplateId: number): string => {
    let iconName: string = "Table";
    switch (baseTemplateId) {
      case 100: // Custom List
      case 120: // Custom List in Datasheet View
        iconName = "Table";
        break;
      case 200: // Survey QUestions
      case 103: // Links
        iconName = "Link";
        break;
      case 104: //Announcements
        iconName = "Megaphone";
        break;
      case 105: // Contacts
        iconName = "Contact";
        break;
      case 106: // Calendar
        iconName = "Calendar";
        break;
      case 107: // Tasks (2010)
        iconName = "TaskLogo";
        break;
      case 108: // Discussion Board
        iconName = "OfficeChat";
        break;
      case 118: // Custom Workflow Process
        iconName = "Flow";
        break;
      case 140: // Workflow History
        iconName = "History";
        break;
      case 150: // Project Tasks
        iconName = "TaskGroup";
        break;
      case 170: // Promoted Links
        iconName = "Tiles";
        break;
      case 171: // Tasks
        iconName = "Timeline";
        break;
      case 432: // Status List
        iconName = "Status";
        break;
      case 544: // Persistent Storage List for MySite Published Feed
        iconName = "Storage";
        break;
      case 600: // External List
        iconName = "ExternalLink";
        break;
      case 1230: // Draft Apps
        iconName = "Drafts";
        break;
    }

    return iconName;
  };

  const loadPreRequsites = async () => {
    const lists = await listService.get({
      filter: `Hidden eq false and BaseType eq 0`,
      orderBy: "BaseTemplate",
    });

    const menuFromLists: IContextualMenuItem[] = [];

    lists.forEach(async (list) => {
      const items: IContextualMenuItem[] = [];

      if (list.ContentTypesEnabled && list.AllowContentTypes) {
        const contentTypes = await listService.getContentTypes(list.Title);

        contentTypes
          .filter((contentType) => !contentType.Sealed)
          .forEach(async (contentType) => {
            items?.push({
              key: contentType.StringId,
              text: contentType.Name,
              iconProps: { iconName: "RegularClipping" },
            });
          });
      }

      menuFromLists.push({
        key: list.Id,
        text: list.Title,
        iconProps: { iconName: setIconName(list.BaseTemplate) },
        items: items.length > 0 ? items : undefined,
      });
    });

    setMenu({
      items: menuFromLists,
    });
  };

  React.useEffect(() => {
    (async () => {
      await loadPreRequsites();
    })();
  }, []);

  const quickCreate: IIconProps = { iconName: "CaloriesAdd" };

  return (
    <CommandButton
      iconProps={quickCreate}
      text="List Item Quick Create"
      menuProps={menu}
    />
  );
};

export default QuickCreateButton;

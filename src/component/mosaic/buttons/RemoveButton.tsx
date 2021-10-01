import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  MosaicContext,
  MosaicRootActions,
  MosaicWindowContext,
} from "react-mosaic-component";
import {
  createDefaultToolbarButtonCustomHisui,
  MosaicButtonProps,
} from "./MosaicButton";
export class RemoveButton extends React.PureComponent<MosaicButtonProps> {
  static contextType = MosaicWindowContext;
  context!: MosaicWindowContext;

  render() {
    return (
      <MosaicContext.Consumer>
        {({ mosaicActions }) =>
          createDefaultToolbarButtonCustomHisui(
            "Close Window",
            this.createRemove(mosaicActions),
            <CloseIcon fontSize="small" />
          )
        }
      </MosaicContext.Consumer>
    );
  }

  private createRemove(mosaicActions: MosaicRootActions<any>) {
    return () => {
      mosaicActions.remove(this.context.mosaicWindowActions.getPath());

      if (this.props.onClick) {
        this.props.onClick();
      }
    };
  }
}

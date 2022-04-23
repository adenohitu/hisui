import { IDisposable } from "monaco-editor";

export interface IAction extends IDisposable {
  readonly id: string;
  label: string;
  tooltip: string;
  class: string | undefined;
  enabled: boolean;
  checked?: boolean;
  run(event?: unknown): unknown;
}
export interface IContextMenuEvent {
  readonly shiftKey?: boolean;
  readonly ctrlKey?: boolean;
  readonly altKey?: boolean;
  readonly metaKey?: boolean;
}

export const enum AnchorAxisAlignment {
  VERTICAL,
  HORIZONTAL,
}
export const enum AnchorAlignment {
  LEFT,
  RIGHT,
}
export type KeybindingModifier = "ctrl" | "shift" | "alt" | "meta";
export class ResolvedKeybindingPart {
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;

  readonly keyLabel: string | null;
  readonly keyAriaLabel: string | null;

  constructor(
    ctrlKey: boolean,
    shiftKey: boolean,
    altKey: boolean,
    metaKey: boolean,
    kbLabel: string | null,
    kbAriaLabel: string | null
  ) {
    this.ctrlKey = ctrlKey;
    this.shiftKey = shiftKey;
    this.altKey = altKey;
    this.metaKey = metaKey;
    this.keyLabel = kbLabel;
    this.keyAriaLabel = kbAriaLabel;
  }
}
export abstract class ResolvedKeybinding {
  /**
   * This prints the binding in a format suitable for displaying in the UI.
   */
  public abstract getLabel(): string | null;
  /**
   * This prints the binding in a format suitable for ARIA.
   */
  public abstract getAriaLabel(): string | null;
  /**
   * This prints the binding in a format suitable for electron's accelerators.
   * See https://github.com/electron/electron/blob/master/docs/api/accelerator.md
   */
  public abstract getElectronAccelerator(): string | null;
  /**
   * This prints the binding in a format suitable for user settings.
   */
  public abstract getUserSettingsLabel(): string | null;
  /**
   * Is the user settings label reflecting the label?
   */
  public abstract isWYSIWYG(): boolean;

  /**
   * Is the binding a chord?
   */
  public abstract isChord(): boolean;

  /**
   * Returns the parts that comprise of the keybinding.
   * Simple keybindings return one element.
   */
  public abstract getParts(): ResolvedKeybindingPart[];

  /**
   * Returns the parts that should be used for dispatching.
   * Returns null for parts consisting of only modifier keys
   * @example keybinding "Shift" -> null
   * @example keybinding ("D" with shift == true) -> "shift+D"
   */
  public abstract getDispatchParts(): (string | null)[];

  /**
   * Returns the parts that should be used for dispatching single modifier keys
   * Returns null for parts that contain more than one modifier or a regular key.
   * @example keybinding "Shift" -> "shift"
   * @example keybinding ("D" with shift == true") -> null
   */
  public abstract getSingleModifierDispatchParts(): (KeybindingModifier | null)[];
}
export interface IActionRunner extends IDisposable {
  readonly onDidRun: any;
  readonly onBeforeRun: any;

  run(action: IAction, context?: unknown): unknown;
}

export interface IContextMenuDelegate {
  getAnchor():
    | HTMLElement
    | { x: number; y: number; width?: number; height?: number };
  getActions(): readonly IAction[];
  getCheckedActionsRepresentation?(action: IAction): "radio" | "checkbox";
  getActionViewItem?(action: IAction): IActionViewItem | undefined;
  getActionsContext?(event?: IContextMenuEvent): unknown;
  getKeyBinding?(action: IAction): ResolvedKeybinding | undefined;
  getMenuClassName?(): string;
  onHide?(didCancel: boolean): void;
  actionRunner?: IActionRunner;
  autoSelectFirstItem?: boolean;
  anchorAlignment?: AnchorAlignment;
  anchorAxisAlignment?: AnchorAxisAlignment;
  domForShadowRoot?: HTMLElement;
}
export interface IActionViewItem extends IDisposable {
  action: IAction;
  actionRunner: IActionRunner;
  setActionContext(context: unknown): void;
  render(element: HTMLElement): void;
  isEnabled(): boolean;
  focus(fromRight?: boolean): void; // TODO@isidorn what is this?
  blur(): void;
}

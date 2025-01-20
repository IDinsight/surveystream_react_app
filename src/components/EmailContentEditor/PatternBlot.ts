import Quill from "quill";

const Inline = Quill.import("blots/inline");

export class ValidVariableBlot extends Inline {
  static blotName = "valid-variable";
  static tagName = "span";
  static className = "valid-variable-blot";

  static create(value: any) {
    const node: any = super.create();
    node.setAttribute("data-pattern", value);
    node.setAttribute("contenteditable", "false");
    return node;
  }

  static formats(node: any) {
    return node.getAttribute("data-pattern");
  }

  deleteAt() {
    this.remove();
  }
}

export class InValidVariableBlot extends Inline {
  static blotName = "invalid-variable";
  static tagName = "span";
  static className = "invalid-variable-blot";

  static create(value: any) {
    const node: any = super.create();
    node.setAttribute("data-pattern", value);
    node.setAttribute("contenteditable", "false");
    return node;
  }

  static formats(node: any) {
    return node.getAttribute("data-pattern");
  }

  deleteAt() {
    this.remove();
  }
}

Quill.register(ValidVariableBlot);
Quill.register(InValidVariableBlot);

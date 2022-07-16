import shortUUID from "short-uuid";

export class Secret {
  uuid;
  content;
  views;

  constructor(content, password) {
    this.uuid = shortUUID.generate();
    this.content = content;
    this.views = 0;
  }
}

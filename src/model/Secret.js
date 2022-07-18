import shortUUID from "short-uuid";

export class Secret {
  uuid;
  content;

  constructor(content, password) {
    this.uuid = shortUUID.generate();
    this.content = content;
  }
}

import shortUUID from "short-uuid";

export class Secret {
  uuid;
  content;
  expiration;

  constructor(content) {
    this.uuid = shortUUID.generate();
    this.content = content;
    this.expiration = new Date().setDate(new Date().getDate() + 7);
  }
}

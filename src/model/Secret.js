import shortUUID from "short-uuid";

export class Secret {
  uuid;
  content;
  views;
  expiration;

  constructor(content) {
    this.uuid = shortUUID.generate();
    this.content = content;
    this.views = 0;
    this.expiration = new Date().setMinutes(new Date().getMinutes() + 2);
  }
}

export type ContactCopy = {
  readonly headline: string;
  readonly paragraph: readonly [string, string];
  readonly fields: {
    readonly name: string;
    readonly email: string;
    readonly message: string;
  };
  readonly submit: {
    readonly idle: string;
    readonly pending: string;
  };
  readonly success: {
    readonly heading: string;
    readonly body: string;
  };
  readonly errors: {
    readonly nameRequired: string;
    readonly emailInvalid: string;
    readonly messageTooShort: string;
    readonly tooLong: string;
    readonly network: string;
  };
  readonly mailtoAddress: string;
};

export const contactCopy = {
  headline: "TELL ME WHAT YOU WANT",
  paragraph: [
    "One person. A few projects at a time.",
    "You tell me what you're building. I come back with the shape of it.",
  ],
  fields: {
    name: "Your Name",
    email: "Your Email",
    message: "Project Details",
  },
  submit: {
    idle: "SEND IT",
    pending: "SENDING",
  },
  success: {
    heading: "Got it.",
    body: "I'll write back within two days.",
  },
  errors: {
    nameRequired: "I'll need a name.",
    emailInvalid: "That email looks wrong.",
    messageTooShort: "Say a bit more.",
    tooLong: "Tighten it up.",
    network:
      "Something went sideways. Try again, or email danharryge@gmail.com directly.",
  },
  mailtoAddress: "danharryge@gmail.com",
} as const satisfies ContactCopy;

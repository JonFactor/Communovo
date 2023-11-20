export interface IEventType {
  name: string;
  description: string;
  mainBgColor: string;
  secondaryBgColor: string;
}

const EventTypeList: Array<IEventType> = [
  {
    name: "Job Fairs",
    description:
      "Want to meet employers while getting free food? Attend a job fair!",
    mainBgColor: "green-400",
    secondaryBgColor: "blue-300",
  },
  {
    name: "Concerts",
    description:
      "Country, Rock, Indie and much more; concerts are the best way to experience your favorite artist",
    mainBgColor: "#5fddea",
    secondaryBgColor: "#d85fea",
  },
  {
    name: "Tourniments",
    description:
      "Compete in friendly compition for topics such as: athletics, hobbies, programing, and much more!",
    mainBgColor: "#EA5F5F",
    secondaryBgColor: "#E8EA5F",
  },
  {
    name: "Voluneteering",
    description:
      "Want to find the best way to give back to your community? Dive into this section.",
    mainBgColor: "#5F89EA",
    secondaryBgColor: "#A15FEA",
  },
  {
    name: "Meetups",
    description:
      "Express yourself through your favoriet hobby with your comminity",
    mainBgColor: "#5FEA69",
    secondaryBgColor: "#5FEACA",
  },
  {
    name: "Drives",
    description: "Collect items/funds for your favorite cause",
    mainBgColor: "#5FEAB8",
    secondaryBgColor: "#ADEA5F",
  },
  {
    name: "Camps",
    description:
      "Want to learn a new skill, while connecting with others? Attend a coding camp.",
    mainBgColor: "#5FEAB8",
    secondaryBgColor: "#ADEA5F",
  },
];

export default EventTypeList;

function warningIng(
  ingredientData: {
    dayAcquired: Date;
    category: { daysGoodFor: number; name: any };
    name: any;
    quantity: any;
  }[]
): string[] {
  return ingredientData?.map(
    (a: {
      dayAcquired: Date;
      category: { daysGoodFor: number; name: any };
      name: any;
      quantity: any;
    }) => {
      const dayUseBy = new Date(a.dayAcquired);
      dayUseBy.setDate(dayUseBy.getDate() + a.category.daysGoodFor);
      const diff = Math.floor(
        (Date.UTC(
          a.dayAcquired.getFullYear(),
          a.dayAcquired.getMonth(),
          a.dayAcquired.getDate()
        ) -
          Date.UTC(
            dayUseBy.getFullYear(),
            dayUseBy.getMonth(),
            dayUseBy.getDate()
          )) /
          (1000 * 60 * 60 * 24)
      );
      if (diff < 3) {
        //if less than 3 days away:
        return `<li>${a.name}  ${a.quantity} ${
          a.category.name
        } ${JSON.stringify(a.dayAcquired).slice(1, 11)} ${JSON.stringify(
          dayUseBy
        ).slice(1, 11)}</li>`;
      } else {
        return "";
      }

      // return (`<li>${a.name}  ${a.quantity} ${a.category.name} ${JSON.stringify(
      //   a.dayAcquired
      // ).slice(1, 11)} ${JSON.stringify(dayUseBy).slice(1, 11)}</li>`);
    }
  );
}
export default warningIng;

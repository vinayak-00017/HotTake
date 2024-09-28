export enum Vote {
  UP = "UP",
  DOWN = "DOWN",
}

export const calculateVotes = (votes: any) => {
  let count = 0;
  if (votes) {
    const votesArray = votes.slice(1, -1).split(",");
    console.log(votesArray);
    votesArray.forEach((vote: any) => {
      if (Vote.UP === vote.trim()) {
        count++;
      } else if (Vote.DOWN === vote.trim()) {
        count--;
      }
    });
  }
  return count;
};

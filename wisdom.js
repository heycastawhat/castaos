const quotes = [
"A bug is just a misunderstood feature.",
"When you aim for the stars, you most definitely won’t reach them, but you will have a great time on your fall until you smack on the ground and DIE",
"Just push it to main and see what happens.",
"Why do we need comments when the code is self-explanatory?",
"I love pinterest.",
"I dont even understand my code sometimes.",
"I wont question where the code is from if it works",
"I love Animal Crossing",
"If theres a quizlet, theres an Excellence",
"The calculator said 2+2=5 so who am I to argue?",
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("clickMe").textContent = quotes[randomIndex];
}

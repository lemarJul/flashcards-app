const flashcards = [
  {
    question: "What is the capital of France?",
    answer: "Paris",
    category: ["Geography"],
  },
  {
    question: "What is the capital of Germany?",
    answer: "Berlin",
    category: ["Geography"],

  },
  {
    question: "What is the capital of Italy?",
    answer: "Rome",
    category: ["Geography"],
  },
  {
    question: "What is the capital of Spain?",
    answer: "Madrid",
    category: ["Geography"],
  },
  {
    question: "What is the capital of Portugal?",
    answer: "Lisbon",
    category: ["Geography"],
  },

  {
    question: "What is the largest planet in our solar system?",
    answer: "Jupiter",
    category: ["General Knowledge"],
  },
  {
    question: "Who wrote the play 'Romeo and Juliet'?",
    answer: "William Shakespeare",
    category: ["General Knowledge"],
  },
  {
    question: "In which year did the Titanic sink?",
    answer: "1912",
    category: ["General Knowledge"],
  },
  {
    question: "What is the capital city of Australia?",
    answer: "Canberra",
    category: ["General Knowledge"],
  },
  {
    question: "Who is known as the 'Father of Computer Science'?",
    answer: "Alan Turing",
    category: ["General Knowledge"],
  },

  {
    question: "Who was the first President of the United States?",
    answer: "George Washington",
    category: ["History"],
  },
  {
    question: "In which year did World War I begin?",
    answer: "1914",
    category: ["History"],
  },
  {
    question:
      "Who was the leader of the Soviet Union during the Cuban Missile Crisis?",
    answer: "Nikita Khrushchev",
    category: ["History"],
  },
  {
    question: "What ancient civilization built the pyramids in Egypt?",
    answer: "Ancient Egyptians",
    category: ["History"],
  },
  {
    question: "Who was the first woman to win a Nobel Prize?",
    answer: "Marie Curie",
    category: ["History"],
  },

  {
    question: "What is the chemical symbol for gold?",
    answer: "Au",
    category: ["Science"],
  },
  {
    question: "Who is known for the laws of motion and universal gravitation?",
    answer: "Isaac Newton",
    category: ["Science"],
  },
  {
    question: "What gas do plants absorb during photosynthesis?",
    answer: "Carbon dioxide",
    category: ["Science"],
  },
  {
    question: "What is the smallest unit of life?",
    answer: "Cell",
    category: ["Science"],
  },
  {
    question: "Which element has the atomic number 1?",
    answer: "Hydrogen",
    category: ["Science"],
  },

  {
    question: "What is the capital of Japan?",
    answer: "Tokyo",
    category: ["Geography"],
  },
  {
    question: "Which river is the longest in the world?",
    answer: "Nile",
    category: ["Geography"],
  },
  {
    question: "In which mountain range is Mount Everest located?",
    answer: "Himalayas",
    category: ["Geography"],
  },
  {
    question: "What is the largest ocean on Earth?",
    answer: "Pacific Ocean",
    category: ["Geography"],
  },
  {
    question: "Which desert is the largest in the world?",
    answer: "Sahara Desert",
    category: ["Geography"],
  },

  {
    question:
      "Who won the Academy Award for Best Actor in 2020 for his role in 'Joker'?",
    answer: "Joaquin Phoenix",
    category: ["Pop Culture"],
  },
  {
    question: "Which animated movie features a character named Simba?",
    answer: "The Lion King",
    category: ["Pop Culture"],
  },
  {
    question: "Who is the lead vocalist of the band Queen?",
    answer: "Freddie Mercury",
    category: ["Pop Culture"],
  },
  {
    question:
      "Which TV series follows the lives of the Pritchett-Dunphy-Tucker family?",
    answer: "Modern Family",
    category: ["Pop Culture"],
  },
  {
    question: "In which year was the first iPhone released?",
    answer: "2007",
    category: ["Pop Culture"],
  },

  {
    question: "Which country won the FIFA World Cup in 2018?",
    answer: "France",
    category: ["Sports"],
  },
  {
    question: "In which sport would you perform a slam dunk?",
    answer: "Basketball",
    category: ["Sports"],
  },
  {
    question:
      "Who is often referred to as 'The Greatest' in the sport of boxing?",
    answer: "Muhammad Ali",
    category: ["Sports"],
  },
  {
    question: "Which tennis player has won the most Grand Slam singles titles?",
    answer: "Margaret Court",
    category: ["Sports"],
  },
  {
    question: "In which city did the first modern Olympic Games take place?",
    answer: "Athens",
    category: ["Sports"],
  },

  {
    question: "Who wrote the novel 'To Kill a Mockingbird'?",
    answer: "Harper Lee",
    category: ["Literature"],
  },
  {
    question: "In which play does the character Hamlet appear?",
    answer: "Hamlet",
    category: ["Literature"],
  },
  {
    question: "Who is the author of 'Pride and Prejudice'?",
    answer: "Jane Austen",
    category: ["Literature"],
  },
  {
    question: "Which dystopian novel is set in the fictional state of Oceania?",
    answer: "1984",
    category: ["Literature"],
  },
  {
    question:
      "What is the name of the wizarding school in the Harry Potter series?",
    answer: "Hogwarts",
    category: ["Literature"],
  },

  {
    question: "Who painted the 'Mona Lisa'?",
    answer: "Leonardo da Vinci",
    category: ["Art and Music"],
  },
  {
    question: "Which composer is famous for his 'Fifth Symphony'?",
    answer: "Ludwig van Beethoven",
    category: ["Art and Music"],
  },
  {
    question: "Who is known for the art technique called 'impressionism'?",
    answer: "Claude Monet",
    category: ["Art and Music"],
  },
  {
    question: "Which rock band released the album 'The Dark Side of the Moon'?",
    answer: "Pink Floyd",
    category: ["Art and Music"],
  },
  {
    question: "Who sculpted the statue of David?",
    answer: "Michelangelo",
    category: ["Art and Music"],
  },

  {
    question: "Who co-founded Microsoft with Bill Gates?",
    answer: "Paul Allen",
    category: ["Technology"],
  },
  {
    question: "What does the acronym 'URL' stand for?",
    answer: "Uniform Resource Locator",
    category: ["Technology"],
  },
  {
    question: "In which year was the first computer mouse invented?",
    answer: "1964",
    category: ["Technology"],
  },
  {
    question:
      "Which programming language is often used for artificial intelligence?",
    answer: "Python",
    category: ["Technology"],
  },
  {
    question: "What does 'HTML' stand for in web development?",
    answer: "Hypertext Markup Language",
    category: ["Technology"],
  },

  {
    question: "What is the largest mammal in the world?",
    answer: "Blue Whale",
    category: ["Nature and Environment"],
  },
  {
    question: "Which gas makes up the majority of Earth's atmosphere?",
    answer: "Nitrogen",
    category: ["Nature and Environment"],
  },
  {
    question: "What is the process by which green plants make their own food?",
    answer: "Photosynthesis",
    category: ["Nature and Environment"],
  },
  {
    question:
      "Which rainforest is often referred to as the 'Lungs of the Earth'?",
    answer: "Amazon Rainforest",
    category: ["Nature and Environment"],
  },
  {
    question: "What is the largest coral reef system in the world?",
    answer: "Great Barrier Reef",
    category: ["Nature and Environment"],
  },
];

module.exports = flashcards;

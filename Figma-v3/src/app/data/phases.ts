export const phaseData = {
  introduction: {
    id: "introduction",
    title: "Introduction",
    description: "Learn how to make a great first impression",
    icon: "Sparkles",
    color: "from-pink-400 to-rose-400",
    image: "https://images.unsplash.com/photo-1573497019329-8c73173b95fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJtJTIwc21pbGUlMjBpbnRyb2R1Y3Rpb24lMjBtZWV0aW5nfGVufDF8fHx8MTc3NTQwOTE4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    steps: [
      {
        title: "First Impressions Matter",
        content: "Your first impression sets the tone. Smile genuinely, make eye contact, and show you're interested in getting to know them.",
        tips: [
          "Dress appropriately for the setting",
          "Arrive on time or a few minutes early",
          "Put your phone away",
        ],
      },
      {
        title: "Breaking the Ice",
        content: "Start with light, friendly conversation. Ask open-ended questions and share a bit about yourself too.",
        tips: [
          "Ask about their interests and hobbies",
          "Find common ground",
          "Keep the conversation balanced",
        ],
      },
      {
        title: "Body Language",
        content: "Non-verbal communication is just as important as what you say. Be mindful of your posture and gestures.",
        tips: [
          "Maintain good posture",
          "Mirror their energy level",
          "Use open body language",
        ],
      },
    ],
  },
  meeting: {
    id: "meeting",
    title: "Meeting the Person",
    description: "Master the art of meaningful connection",
    icon: "Users",
    color: "from-amber-400 to-orange-400",
    image: "https://images.unsplash.com/photo-1599408444561-cfca579e1f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNvdXBsZSUyMGNvZmZlZSUyMGRhdGV8ZW58MXx8fHwxNzc1NDA5MTg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    steps: [
      {
        title: "Active Listening",
        content: "Show genuine interest in what they're saying. Listen more than you speak and ask follow-up questions.",
        tips: [
          "Don't interrupt",
          "Remember details they share",
          "Show empathy and understanding",
        ],
      },
      {
        title: "Share Your Story",
        content: "Open up about yourself in a natural way. Share your passions, experiences, and what matters to you.",
        tips: [
          "Be authentic and honest",
          "Share positive experiences",
          "Avoid oversharing too soon",
        ],
      },
      {
        title: "Reading the Signs",
        content: "Pay attention to their comfort level and interest. Respect boundaries and adjust your approach accordingly.",
        tips: [
          "Notice their body language",
          "Respect personal space",
          "Be aware of verbal cues",
        ],
      },
    ],
  },
  dating: {
    id: "dating",
    title: "Going on Dates",
    description: "Create memorable experiences together",
    icon: "Heart",
    color: "from-purple-400 to-pink-400",
    image: "https://images.unsplash.com/photo-1621596016740-c831e613dc49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGRpbm5lciUyMGRhdGUlMjByZXN0YXVyYW50fGVufDF8fHx8MTc3NTQwOTE4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    steps: [
      {
        title: "Planning Dates",
        content: "Choose activities that allow conversation and connection. Consider their interests and preferences.",
        tips: [
          "Suggest a variety of date ideas",
          "Be flexible and open to their suggestions",
          "Plan ahead but be spontaneous too",
        ],
      },
      {
        title: "During the Date",
        content: "Be present, engaged, and enjoy the moment. Focus on having fun and getting to know each other better.",
        tips: [
          "Be yourself and relax",
          "Show appreciation",
          "Keep conversation light and positive",
        ],
      },
      {
        title: "Building Connection",
        content: "Gradually deepen your emotional connection. Share more meaningful conversations and experiences.",
        tips: [
          "Be vulnerable when appropriate",
          "Create shared memories",
          "Show consistent interest",
        ],
      },
      {
        title: "Moving Forward",
        content: "Communicate about your feelings and where you see things going. Be honest about your intentions.",
        tips: [
          "Have open conversations about expectations",
          "Be clear about what you want",
          "Respect their pace and feelings",
        ],
      },
    ],
  },
  maintaining: {
    id: "maintaining",
    title: "Maintaining the Relationship",
    description: "Nurture and grow your connection",
    icon: "Leaf",
    color: "from-emerald-400 to-teal-400",
    image: "https://images.unsplash.com/photo-1675260832247-8b8393b34a4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBob2xkaW5nJTIwaGFuZHMlMjBzdW5zZXR8ZW58MXx8fHwxNzc1NDA5MTg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    steps: [
      {
        title: "Communication is Key",
        content: "Keep lines of communication open. Share your thoughts, feelings, and listen to theirs.",
        tips: [
          "Have regular check-ins",
          "Address issues early and calmly",
          "Express appreciation often",
        ],
      },
      {
        title: "Quality Time Together",
        content: "Make time for each other despite busy schedules. Prioritize your relationship.",
        tips: [
          "Schedule regular date nights",
          "Try new activities together",
          "Create rituals and traditions",
        ],
      },
      {
        title: "Supporting Each Other",
        content: "Be there for them through ups and downs. Show support for their goals and dreams.",
        tips: [
          "Celebrate their successes",
          "Offer comfort during tough times",
          "Encourage personal growth",
        ],
      },
      {
        title: "Keeping the Spark Alive",
        content: "Continue to nurture romance and intimacy. Don't let the relationship become routine.",
        tips: [
          "Surprise them occasionally",
          "Keep learning about each other",
          "Maintain physical and emotional intimacy",
        ],
      },
    ],
  },
};

export type Phase = keyof typeof phaseData;

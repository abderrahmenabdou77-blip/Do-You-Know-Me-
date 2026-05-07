// Questions pool - bilingual (Arabic & English)
// ar       → يُعرض للشخص الأول (answerer) كما هو
// ar_about → يُعرض للشخص الثاني (guesser)، استبدل {name} باسم الشخص الأول
const questions = [
  // Food & Drinks
  { id: 1, en: "What is your favorite food?", ar: "ما هي اكلتك المفضلة؟", ar_about: "ما هي اكلة {name} المفضلة؟", category: "food" },
  { id: 2, en: "What is your favorite drink?", ar: "ما هو مشروبك المفضل؟", ar_about: "ما هو مشروب {name} المفضل؟", category: "food" },
  { id: 3, en: "What is your favorite dessert?", ar: "ما هو حلواك المفضلة؟", ar_about: "ما هو حلوى {name} المفضلة؟", category: "food" },
  { id: 4, en: "What food do you absolutely hate?", ar: "ما هو الطعام الذي تكرهه تمامًا؟", ar_about: "ما هو الطعام الذي يكرهه {name} تمامًا؟", category: "food" },
  { id: 5, en: "What is your go-to fast food order?", ar: "ما هو طلبك المعتاد من الوجبات السريعة؟", ar_about: "ما هو طلب {name} المعتاد من الوجبات السريعة؟", category: "food" },
  { id: 6, en: "What is your favorite cuisine (Italian, Chinese, etc.)?", ar: "ما هو مطبخك المفضل (إيطالي، صيني...؟", ar_about: "ما هو المطبخ المفضل لـ{name} (إيطالي، صيني...؟", category: "food" },
  { id: 7, en: "What snack do you always have at home?", ar: "ما هي الوجبة الخفيفة التي لديك دائمًا في المنزل؟", ar_about: "ما هي الوجبة الخفيفة التي لدى {name} دائمًا في المنزل؟", category: "food" },
  { id: 8, en: "Coffee or tea?", ar: "قهوة أم شاي؟", ar_about: "هل يفضل {name} القهوة أم الشاي؟", category: "food" },
  { id: 9, en: "What is your favorite fruit?", ar: "ما هي فاكهتك المفضلة؟", ar_about: "ما هي فاكهة {name} المفضلة؟", category: "food" },
  { id: 10, en: "What would be your last meal on earth?", ar: "ما هي وجبتك الأخيرة على الأرض؟", ar_about: "ما هي وجبة {name} الأخيرة على الأرض؟", category: "food" },

  // Entertainment
  { id: 11, en: "What is your favorite movie of all time?", ar: "ما هو فيلمك المفضل على الإطلاق؟", ar_about: "ما هو فيلم {name} المفضل على الإطلاق؟", category: "entertainment" },
  { id: 12, en: "What is your favorite TV show or series?", ar: "ما هو مسلسلك أو برنامجك التلفزيوني المفضل؟", ar_about: "ما هو المسلسل أو البرنامج التلفزيوني المفضل لـ{name}؟", category: "entertainment" },
  { id: 13, en: "What genre of music do you love the most?", ar: "ما هو نوع الموسيقى الذي تحبه أكثر؟", ar_about: "ما هو نوع الموسيقى الذي يحبه {name} أكثر؟", category: "entertainment" },
  { id: 14, en: "Who is your favorite singer or band?", ar: "من هو مغنيك أو فرقتك المفضلة؟", ar_about: "من هو المغني أو الفرقة المفضلة لـ{name}؟", category: "entertainment" },
  { id: 15, en: "What is your favorite sport to watch?", ar: "ما هو رياضتك المفضلة للمشاهدة؟", ar_about: "ما هي الرياضة المفضلة لـ{name} للمشاهدة؟", category: "entertainment" },
  { id: 16, en: "What is your favorite sport to play?", ar: "ما هي رياضتك المفضلة للممارسة؟", ar_about: "ما هي الرياضة المفضلة لـ{name} للممارسة؟", category: "entertainment" },
  { id: 17, en: "Do you prefer movies or series?", ar: "هل تفضل الأفلام أم المسلسلات؟", ar_about: "هل يفضل {name} الأفلام أم المسلسلات؟", category: "entertainment" },
  { id: 18, en: "What is your favorite video game?", ar: "ما هي لعبة الفيديو المفضلة لديك؟", ar_about: "ما هي لعبة الفيديو المفضلة لدى {name}؟", category: "entertainment" },
  { id: 19, en: "What type of books do you enjoy reading?", ar: "ما نوع الكتب التي تستمتع بقراءتها؟", ar_about: "ما نوع الكتب التي يستمتع {name} بقراءتها؟", category: "entertainment" },
  { id: 20, en: "What is your favorite social media platform?", ar: "ما هي منصة التواصل الاجتماعي المفضلة لديك؟", ar_about: "ما هي منصة التواصل الاجتماعي المفضلة لدى {name}؟", category: "entertainment" },

  // Personality & Habits
  { id: 21, en: "Are you a morning person or a night owl?", ar: "هل أنت شخص صباحي أم سهراني؟", ar_about: "هل {name} شخص صباحي أم سهراني؟", category: "personality" },
  { id: 22, en: "What is your biggest fear?", ar: "ما هو أكبر خوف لديك؟", ar_about: "ما هو أكبر خوف لدى {name}؟", category: "personality" },
  { id: 23, en: "What is your dream job?", ar: "ما هي وظيفتك الحلم؟", ar_about: "ما هي وظيفة {name} الحلم؟", category: "personality" },
  { id: 24, en: "What is your biggest pet peeve?", ar: "ما هو الشيء الذي يزعجك أكثر شيء؟", ar_about: "ما هو الشيء الذي يزعج {name} أكثر شيء؟", category: "personality" },
  { id: 25, en: "Are you an introvert or extrovert?", ar: "هل أنت انطوائي أم اجتماعي؟", ar_about: "هل {name} انطوائي أم اجتماعي؟", category: "personality" },
  { id: 26, en: "What is your love language?", ar: "ما هي لغة حبك؟", ar_about: "ما هي لغة حب {name}؟", category: "personality" },
  { id: 27, en: "What is your most used emoji?", ar: "ما هو الإيموجي الذي تستخدمه أكثر؟", ar_about: "ما هو الإيموجي الذي يستخدمه {name} أكثر؟", category: "personality" },
  { id: 28, en: "What superpower would you choose?", ar: "ما هي القوة الخارقة التي ستختارها؟", ar_about: "ما هي القوة الخارقة التي سيختارها {name}؟", category: "personality" },
  { id: 29, en: "What is your zodiac sign?", ar: "ما هو برجك؟", ar_about: "ما هو برج {name}؟", category: "personality" },
  { id: 30, en: "What is your biggest guilty pleasure?", ar: "ما هو أكبر متعة سرية لديك؟", ar_about: "ما هو أكبر متعة سرية لدى {name}؟", category: "personality" },
  { id: 31, en: "Do you prefer cats or dogs?", ar: "هل تفضل القطط أم الكلاب؟", ar_about: "هل يفضل {name} القطط أم الكلاب؟", category: "personality" },
  { id: 32, en: "What is your favorite season?", ar: "ما هو فصلك المفضل؟", ar_about: "ما هو الفصل المفضل لـ{name}؟", category: "personality" },
  { id: 33, en: "What is your go-to coping mechanism when stressed?", ar: "ما هي طريقتك للتعامل مع الضغط؟", ar_about: "ما هي طريقة {name} للتعامل مع الضغط؟", category: "personality" },
  { id: 34, en: "What is your biggest accomplishment?", ar: "ما هو أكبر إنجازاتك؟", ar_about: "ما هو أكبر إنجازات {name}؟", category: "personality" },
  { id: 35, en: "What makes you laugh the most?", ar: "ما الذي يضحكك أكثر شيء؟", ar_about: "ما الذي يضحك {name} أكثر شيء؟", category: "personality" },

  // Travel & Places
  { id: 36, en: "What is your dream travel destination?", ar: "ما هي وجهة سفرك الحلم؟", ar_about: "ما هي وجهة سفر {name} الحلم؟", category: "travel" },
  { id: 37, en: "Beach or mountains?", ar: "شاطئ أم جبال؟", ar_about: "هل يفضل {name} الشاطئ أم الجبال؟", category: "travel" },
  { id: 38, en: "What country would you love to live in?", ar: "في أي بلد تود العيش؟", ar_about: "في أي بلد يود {name} العيش؟", category: "travel" },
  { id: 39, en: "What is the best place you have ever visited?", ar: "ما هو أفضل مكان زرته على الإطلاق؟", ar_about: "ما هو أفضل مكان زاره {name} على الإطلاق؟", category: "travel" },
  { id: 40, en: "City life or countryside?", ar: "حياة المدينة أم الريف؟", ar_about: "هل يفضل {name} حياة المدينة أم الريف؟", category: "travel" },

  // Random & Fun
  { id: 41, en: "If you won the lottery, what is the first thing you would buy?", ar: "لو فزت باليانصيب، ما أول شيء ستشتريه؟", ar_about: "لو فاز {name} باليانصيب، ما أول شيء سيشتريه؟", category: "fun" },
  { id: 42, en: "What is one thing you cannot live without?", ar: "ما هو شيء واحد لا تستطيع العيش بدونه؟", ar_about: "ما هو شيء واحد لا يستطيع {name} العيش بدونه؟", category: "fun" },
  { id: 43, en: "If you could have dinner with anyone (dead or alive), who would it be?", ar: "لو كان بإمكانك تناول العشاء مع أي شخص، من سيكون؟", ar_about: "لو كان بإمكان {name} تناول العشاء مع أي شخص، من سيكون؟", category: "fun" },
  { id: 44, en: "What is your hidden talent?", ar: "ما هي موهبتك المخفية؟", ar_about: "ما هي موهبة {name} المخفية؟", category: "fun" },
  { id: 45, en: "What is the weirdest thing you have ever eaten?", ar: "ما هو أغرب شيء أكلته؟", ar_about: "ما هو أغرب شيء أكله {name}؟", category: "fun" },
  { id: 46, en: "What decade would you go back to if you could time travel?", ar: "أي عقد ستعود إليه لو كان بإمكانك السفر عبر الزمن؟", ar_about: "أي عقد سيعود إليه {name} لو كان بإمكانه السفر عبر الزمن؟", category: "fun" },
  { id: 47, en: "What is your most embarrassing moment?", ar: "ما هو أكثر موقف محرج مررت به؟", ar_about: "ما هو أكثر موقف محرج مر به {name}؟", category: "fun" },
  { id: 48, en: "What is one skill you wish you had?", ar: "ما هي مهارة واحدة تتمنى امتلاكها؟", ar_about: "ما هي مهارة واحدة يتمنى {name} امتلاكها؟", category: "fun" },
  { id: 49, en: "What would your perfect day look like?", ar: "كيف سيبدو يومك المثالي؟", ar_about: "كيف سيبدو اليوم المثالي لـ{name}؟", category: "fun" },
  { id: 50, en: "What is your childhood nickname?", ar: "ما هو لقبك في الطفولة؟", ar_about: "ما هو لقب {name} في الطفولة؟", category: "fun" },
  { id: 51, en: "What is the most spontaneous thing you have ever done?", ar: "ما هو أكثر شيء عفوي قمت به؟", ar_about: "ما هو أكثر شيء عفوي قام به {name}؟", category: "fun" },
  { id: 52, en: "If you were an animal, what would you be?", ar: "لو كنت حيوانًا، ماذا ستكون؟", ar_about: "لو كان {name} حيوانًا، ماذا سيكون؟", category: "fun" },
  { id: 53, en: "What is your favorite childhood memory?", ar: "ما هي ذكراك المفضلة من الطفولة؟", ar_about: "ما هي ذكرى {name} المفضلة من الطفولة؟", category: "fun" },
  { id: 54, en: "What is the first thing you do when you wake up?", ar: "ما هو أول شيء تفعله عند الاستيقاظ؟", ar_about: "ما هو أول شيء يفعله {name} عند الاستيقاظ؟", category: "fun" },
  { id: 55, en: "What is your proudest moment?", ar: "ما هو أفخر لحظاتك؟", ar_about: "ما هو أفخر لحظات {name}؟", category: "fun" },
  { id: 56, en: "Night in or night out?", ar: "سهرة في البيت أم خارجه؟", ar_about: "هل يفضل {name} السهرة في البيت أم خارجه؟", category: "fun" },
  { id: 57, en: "What is your fashion style?", ar: "ما هو أسلوبك في الموضة؟", ar_about: "ما هو أسلوب {name} في الموضة؟", category: "fun" },
  { id: 58, en: "What is your favorite holiday?", ar: "ما هو عطلتك المفضلة؟", ar_about: "ما هي عطلة {name} المفضلة؟", category: "fun" },
  { id: 59, en: "What is your favorite thing to do on weekends?", ar: "ما هو نشاطك المفضل في عطلة نهاية الأسبوع؟", ar_about: "ما هو النشاط المفضل لـ{name} في عطلة نهاية الأسبوع؟", category: "fun" },
  { id: 60, en: "What is your biggest dream in life?", ar: "ما هو حلمك الأكبر في الحياة؟", ar_about: "ما هو حلم {name} الأكبر في الحياة؟", category: "fun" },
];



// ─── Select-mode questions with fixed choices ─────────────────────────────────
// These have pre-defined choices (4 options each) so the guesser picks one.
const selectQuestions = [
  { id: 101, en: "Coffee or tea?", ar: "قهوة أم شاي؟", ar_about: "هل يفضل {name} القهوة أم الشاي؟", category: "food",
    choices: ["Coffee ☕", "Tea 🍵", "Both equally", "Neither"] },
  { id: 102, en: "Cats or dogs?", ar: "قطط أم كلاب؟", ar_about: "هل يفضل {name} القطط أم الكلاب؟", category: "personality",
    choices: ["Cats 🐱", "Dogs 🐶", "Both equally", "Neither"] },
  { id: 103, en: "Beach or mountains?", ar: "شاطئ أم جبال؟", ar_about: "هل يفضل {name} الشاطئ أم الجبال؟", category: "travel",
    choices: ["Beach 🏖️", "Mountains ⛰️", "Both equally", "Prefer city"] },
  { id: 104, en: "Morning person or night owl?", ar: "صباحي أم سهراني؟", ar_about: "هل {name} صباحي أم سهراني؟", category: "personality",
    choices: ["Morning person 🌅", "Night owl 🦉", "Depends on day", "Neither"] },
  { id: 105, en: "Introvert or extrovert?", ar: "انطوائي أم اجتماعي؟", ar_about: "هل {name} انطوائي أم اجتماعي؟", category: "personality",
    choices: ["Introvert 🔇", "Extrovert 🎉", "Ambivert", "Depends"] },
  { id: 106, en: "Movies or series?", ar: "أفلام أم مسلسلات؟", ar_about: "هل يفضل {name} الأفلام أم المسلسلات؟", category: "entertainment",
    choices: ["Movies 🎬", "Series 📺", "Both equally", "Neither"] },
  { id: 107, en: "City life or countryside?", ar: "المدينة أم الريف؟", ar_about: "هل يفضل {name} المدينة أم الريف؟", category: "travel",
    choices: ["City life 🏙️", "Countryside 🌾", "Suburbs", "Doesn't matter"] },
  { id: 108, en: "What is your love language?", ar: "ما هي لغة حبك؟", ar_about: "ما هي لغة حب {name}؟", category: "personality",
    choices: ["Words of affirmation 💬", "Quality time ⏰", "Physical touch 🤗", "Acts of service / Gifts"] },
  { id: 109, en: "What superpower would you choose?", ar: "ما هي القوة الخارقة التي ستختارها؟", ar_about: "ما هي القوة الخارقة التي سيختارها {name}؟", category: "fun",
    choices: ["Fly ✈️", "Invisibility 👻", "Read minds 🧠", "Time travel ⏳"] },
  { id: 110, en: "If you were an animal, what would you be?", ar: "لو كنت حيوانًا، ماذا ستكون؟", ar_about: "لو كان {name} حيوانًا، ماذا سيكون؟", category: "fun",
    choices: ["Lion / Tiger 🦁", "Eagle / Bird 🦅", "Dolphin / Sea creature 🐬", "Wolf / Dog 🐺"] },
  { id: 111, en: "What is your go-to mood when stressed?", ar: "كيف تتعامل مع الضغط؟", ar_about: "كيف يتعامل {name} مع الضغط؟", category: "personality",
    choices: ["Isolate & recharge 🔇", "Talk it out 💬", "Exercise / Walk 🏃", "Eat or sleep 😴"] },
  { id: 112, en: "What kind of movies do you like most?", ar: "ما نوع الأفلام التي تحبها أكثر؟", ar_about: "ما نوع الأفلام التي يحبها {name} أكثر؟", category: "entertainment",
    choices: ["Action / Thriller 💥", "Comedy / Rom-com 😂", "Drama / Horror 🎭", "Sci-fi / Fantasy 🚀"] },
  { id: 113, en: "What is your ideal vacation?", ar: "ما هي إجازتك المثالية؟", ar_about: "ما هي إجازة {name} المثالية؟", category: "travel",
    choices: ["Exploring new cities 🗺️", "Beach / Relaxing 🏝️", "Adventure / Nature 🧗", "Staying home 🏠"] },
  { id: 114, en: "What do you do on a typical weekend?", ar: "ماذا تفعل في عطلة نهاية الأسبوع؟", ar_about: "ماذا يفعل {name} في عطلة نهاية الأسبوع؟", category: "fun",
    choices: ["Go out with friends 🥳", "Stay home & relax 🛋️", "Sports / Gym 🏋️", "Family time 👨‍👩‍👧"] },
  { id: 115, en: "Pick your perfect Friday night:", ar: "اختر أمسيتك المثالية ليلة الجمعة:", ar_about: "ما هي أمسية الجمعة المثالية لـ{name}؟", category: "fun",
    choices: ["Party with friends 🎉", "Quiet movie night 🎬", "Restaurant dinner 🍽️", "Gaming / Online 🎮"] },
  { id: 116, en: "What zodiac element describes you?", ar: "أي عنصر من البروج يصفك؟", ar_about: "أي عنصر من البروج يصف {name}؟", category: "personality",
    choices: ["Fire (Aries, Leo, Sagittarius) 🔥", "Earth (Taurus, Virgo, Capricorn) 🌍", "Air (Gemini, Libra, Aquarius) 💨", "Water (Cancer, Scorpio, Pisces) 💧"] },
  { id: 117, en: "What's your social media vibe?", ar: "ما هو أسلوبك على السوشيال ميديا؟", ar_about: "ما هو أسلوب {name} على السوشيال ميديا؟", category: "personality",
    choices: ["Active poster 📸", "Silent lurker 👀", "Occasional stories 📱", "Almost never online"] },
  { id: 118, en: "Pick your ideal weather:", ar: "اختر طقسك المثالي:", ar_about: "ما هو الطقس المثالي لـ{name}؟", category: "fun",
    choices: ["Warm & sunny ☀️", "Cool & breezy 🌤️", "Rainy & cozy 🌧️", "Cold & snowy ❄️"] },
  { id: 119, en: "When shopping, you are:", ar: "عند التسوق، أنت:", ar_about: "عند التسوق، {name} هو:", category: "personality",
    choices: ["Impulsive buyer 🛒", "Careful planner 📋", "Window shopper only 🪟", "Online only 💻"] },
  { id: 120, en: "Your energy level is usually:", ar: "مستوى طاقتك عادةً:", ar_about: "مستوى طاقة {name} عادةً:", category: "personality",
    choices: ["High energy always 🔋", "Moderate, balanced ⚖️", "Low, reserved 😌", "Depends on mood"] },
];

function getChoicesForQuestion(questionId) {
  const q = selectQuestions.find(q => q.id === questionId);
  return q ? q.choices : null;
}

function getRandomQuestions(count, mode) {
  if (mode === 'select') {
    const shuffled = [...selectQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, selectQuestions.length));
  }
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

module.exports = { questions, selectQuestions, getRandomQuestions, getChoicesForQuestion };

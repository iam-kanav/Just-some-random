const STARTING_CP = 1000;
const STARTING_TOKENS = 5;
const MAX_300CP_TOKEN_USAGE = 2;

let currentCP = STARTING_CP;
let currentTokens = STARTING_TOKENS;
let tokensUsedFor300cp = 0;

const build = {
    location: null,
    origin: null,
    ageSex: null,
    perks: {},
    items: {},
    companions: {},
    drawbacks: {}
};

const cpDisplay = document.getElementById('current-cp');
const tokensDisplay = document.getElementById('current-tokens');
const tokens300cpDisplay = document.getElementById('tokens-300cp-used');
const perksGrid = document.querySelector('.category:nth-of-type(4) .options-grid');
const itemsGrid = document.querySelector('.category:nth-of-type(5) .options-grid');
const companionsGrid = document.querySelector('.category:nth-of-type(6) .options-grid');
const drawbacksGrid = document.querySelector('.category:nth-of-type(7) .options-grid');
const buildSummaryContent = document.getElementById('build-summary-content');

// --- Data Definitions ---
const perksData = [
    { id: 'craftsman', name: 'Craftsman', cost: 100, type: 'multi', maxTier: 10, description: 'Choose a type of craft such as carpentry, blacksmithing, or masonry. You gain the equivalent of ten years of dedicated experience in the chosen craft. You may take this perk multiple times.' },
    { id: 'artiste', name: 'Artiste', cost: 100, description: 'You have an eye for art and a deft hand at the same. You know how to make almost anything look good and can spot cheap imitations versus the real deal. Forgeries will not get passed your eye.' },
    { id: 'academic', name: 'Academic', cost: 100, description: 'Learning comes easy for you. You learn roughly five times faster than before. You are also a disciplined and motivated individual, allowing you to put your full effort into learning.' },
    { id: 'work-through-night', name: 'Work Through The Night', cost: 100, description: 'You have the ability to ignore your exhaustion while working on a craft, at the cost of backlash later down the line. This allows you to work tirelessly for days at a time, so long as you supply your bodily needs otherwise. Once you are finished working, however, you will have a short window of time to settle yourself before you will crash and need to sleep once more, and will do so until you are caught back up.' },
    { id: 'intuition', name: 'Intuition', cost: 100, description: 'You are a natural problem solver, able to look at a problem and spot where the issues actually are and understand them, as well as insights into how they can be solved with your current abilities and skills or if you may need to learn something new to fix the issue.' },
    { id: 'apprenticeship', name: 'Apprenticeship', cost: 100, description: 'You have a knack for finding teachers that are willing to impart their knowledge to you and take you on as an apprentice, you learn twice as fast when you have a teacher, and you can tell when a potential teacher is actually worth your time and effort.' },
    { id: 'mentorship', name: 'Mentorship', cost: 100, description: 'You are a skilled teacher, able to adapt your lessons to your students to best teach them. This is best used with small groups where you can give one-on-one aid to your students. You are also able to spot good students and recognize their talents.' },
    { id: 'sell-what-you-make', name: 'Sell What You Make', cost: 100, description: 'You know what your creations are worth and know, generally, how to make a proper sale with anything you make. This also gives you insights into the prices of similar objects to what you have created.' },
    { id: 'test-your-metal', name: 'Test Your Metal', cost: 100, description: 'When you make something, you get an intimate knowledge of it and how it is to be used, making it easier for you to utilize them for their intended purposes. You will find you write more neatly with a pen you made than one bought off of a shelf, a sword you made would give you an edge in battle over a standard issue one, and similar such instances. This extends to items you\'ve modified, though to a degree proportional to how thoroughly they were changed.' },
    { id: 'monster-hunter', name: 'Monster Hunter', cost: 100, description: 'You have received training in the hunting of great beasts, giving you the physical fitness and skill of a warrior and hunter, with an emphasis on the use of a variety of weapons and tools useful in the hunting of such great beasts. You also know how to harvest the most magically active parts of them for your own use.' },
    { id: 'polyglot', name: 'Polyglot', cost: 100, description: 'Languages come easily to you, letting you learn new languages at a conversational level in just under a week through simple exposure, and getting into full fluency after a month. Actively learning the language can shorten this time considerably. You are also able to swap out the use of one language for another in your works, where applicable.' },
    { id: 'form-equals-function', name: 'Form Equals Function', cost: 100, description: 'Your creations have an unusual property that makes them function better when they look good. A sword made of subpar materials and simple craftsmanship but that looks good will work just as well as one made with good materials and decent skill. A more well-made sword made to look just as good would function even better than it otherwise would. This improves upon every quality of the item.' },
    { id: 'built-to-last', name: 'Built to Last', cost: 100, description: 'Your creations are less likely to break down, are more durable, and need less maintenance to keep functioning. They will last, at least, ten times longer than they otherwise would unless actively broken, and even then, it will take more effort to break them.' },
    { id: 'thrifty', name: 'Thrifty', cost: 100, description: 'When making something and don\'t have one or more of the appropriate materials, you can figure out substitutes that will be easier to acquire and/or cheaper, at the cost of effectiveness. This will result in what you are making being less effective, but the loss will be less than what it likely should be. With practice, you may even be able to make such substitutions just as potent as what was originally called for.' },
    { id: 'demolitionist', name: 'Demolitionist', cost: 100, description: 'You can spot weak points in objects and know how to take advantage of such weak points to break the object in question.' },
    { id: 'endurance', name: 'Endurance', cost: 100, description: 'You have stamina beyond most and all of your energy reserves are deeper and recover rapidly.' },
    { id: 'repair-man', name: 'Repair Man', cost: 100, description: 'You are able to figure out how to repair anything and have the skills to do so, but only so long as it is to repair the objects in question. If in a rush, you can spend a supernatural resource to repair the objects magically.' },
    { id: 'material-refinement', name: 'Material Refinement', cost: 100, description: 'You are practiced in one of the simplest forms of enchanting. This allows you to draw out some of the innate properties of a material or substance and allow it to project that property in some small fashion, such as the stress relieving qualities of an amethyst necklace. The effects of this are minor on their own, but can be combined with other forms of enchanting to create something more potent.' },
    { id: 'modularity', name: 'Modularity', cost: 100, description: 'You have a talent and skill for modular design, able to create simple and efficient means of turning nearly any of your creations into something modular. This makes it incredibly easy to swap out components of your creations for others to make it better suited to your actual needs.' },
    { id: 'speed-build', name: 'Speed Build', cost: 100, description: 'You have the uncanny ability to make things in much less time than they would normally take as you seem able simply get more done in the same amount of time than other people. This cuts about a fifth of the time off of the crafting process.' },
    { id: 'waste-not-want-not', name: 'Waste Not Want Not', cost: 100, description: 'You get the absolute most out of nearly anything you deal with and never seem to waste any of what you have available. What little waste you do produce, however, can be put to use elsewhere with surprising ease. This is not simply for crafting. You will extract the most nutrients from food you ingest, keep full and hydrated for longer, and get the most out of your time sleeping, making all three more efficient and less necessary in general. Your ability to manage time and space as a resource is similarly astounding.' },
    { id: 'feast-famine', name: 'Feast & Famine', cost: 100, description: 'When you eat, drink, or sleep, you can choose to store up any excess as nebulous pools of energy you can use to fulfill those needs later. These are separate for each of the three pools you can draw from, but will sustain your needs well. This will prevent you from suffering the negatives of overindulging in such things. All three energies can be spent to replenish your other energy reserves, including your physical and mental stamina, preventing you from suffering from fatigue as long as you have the energy to spend. This only works if you use all three energies together, however.' },
    { id: 'mastercrafting', name: 'Mastercrafting', cost: 100, description: 'When you make something and actually put a significant effort into it, it just comes out better, as if you had used better quality materials and had better equipment to work with. This improves nearly all aspects of the crafted object, including any supernatural qualities it may possess, as it has the quality of its craftsmanship and materials overcome through skill.' },
    { id: 'crafting-savant', name: 'Crafting Savant', cost: 100, description: 'You are skilled in all manner of crafts and have at least a foundation in any craft you come across even if you have never encountered or heard of it before. You learn crafting oriented skills roughly ten times more quickly. You can also reverse engineer techniques on how to make something by simply watching someone do so or examining the finished product for long enough.' },
    { id: 'harvesting', name: 'Harvesting', cost: 100, type: 'multi-tier', tiers: [{ cost: 100, name: 'Basic Harvesting', description: 'You are exceptional in the acquisition of magical materials. For 100cp, this gives you a knowledge of how to harvest creatures, plants, fungi, minerals, and the like without damaging them as well as the skill to do so. It also gives a general knowledge on how to cultivate the plants, fungi, and tamable creatures.' }, { cost: 100, name: 'Immaterial Harvesting', description: 'For an additional 100cp, you gain the knowledge and ability to capture immaterial things and magical moments, events, or phenomena, such as the first breath of a newborn, the light of a sunrise, or even a single moment of time. You may need specialized tools for some of these, but you will be able to capture and use them in your crafting.' }], description: 'You are exceptional in the acquisition of magical materials.' },
    { id: 'work-crew', name: 'Work Crew', cost: 100, type: 'multi-tier', tiers: [{ cost: 100, name: 'Basic Work Crew', description: 'You know how to put together a group of workers that will work together well and efficiently, promoting teamwork and a rhythm in the crafting. With this, you could turn a group of neophyte workers into a well oiled machine of crafting.' }, { cost: 100, name: 'Psychic Network', description: 'For an additional 100cp, you can create a psychic network that allows those within the work crew to share their skills, talents, knowledge, and perks, if they have them and choose to do so, as well as being able to speak telepathically with each other. You can be a part of this network if you so choose or simply establish one for others. It takes a short induction ritual to add someone to a network. Leaving the network is as easy as willing it.' }], description: 'You know how to put together a group of workers that will work together well and efficiently, promoting teamwork and a rhythm in the crafting.' },
    { id: 'pagemaster', name: 'Pagemaster', cost: 200, description: 'You have the ability to store nearly any supernatural powers or enchantments on paper and ink in the form of scrolls, grimoires, and spell tags. Such creations can carry the supernatural effect, bit of magic, or enchantment until it is used, at which point it is either used up or transfers the enchantment to a new object. Storing a spell, effect, or enchantment in this way uses all the same resources and requires the same level of focus, but can be triggered far more easily when the time comes to do so.' },
    { id: 'ironworker', name: 'Ironworker', cost: 200, description: 'When working with any material while forging, you can make it act as if it were iron. Melting it, working it in the forge, and otherwise affecting it as if it were simple iron. Even ultra-durable and flame resistant materials could be worked as if they were iron in this way.' },
    { id: 'alchemy', name: 'Alchemy', cost: 200, description: 'You know several processes that can be used to break down materials and combine them to bring out, enhance, and mix their magical qualities. Potions, extracts, and oils are common examples of this, however, you have also learned how to create alchemical alloys with magical qualities using base metals.' },
    { id: 'runesmith', name: 'Runesmith', cost: 200, description: 'You have the knowledge of a runic language that is capable of taking in and shaping magic fed into it, as well as how to carve such runes into most solid surfaces. While somewhat simplistic in how it can be applied, these runes require no magical source beyond what the wielder can provide to function.' },
    { id: 'magic-weaver', name: 'Magic Weaver', cost: 200, description: 'You have a knack for incorporating magics and supernatural abilities into your crafting and can split your focus effectively and easily between them. This gives you multiple streams of thought you can use to focus on various aspects of a project or task.' },
    { id: 'curse-weaver', name: 'Curse Weaver', cost: 200, description: 'You have the ability to incorporate a downside or negative quality into your creations, creating cursed magic items. More than this, you can tie the curse into another enchantment to enhance the quality of the enchantment. By tying in downsides, you strengthen whatever positives do exist.' },
    { id: 'quick-chant', name: 'Quick Chant', cost: 200, description: 'You can perform a quick and dirty form of enchantment, allowing you to place a temporary version of any enchantment you can create onto an object with a fairly simple expenditure of power. These temporary enchantments will last for a short time, though this can be increased with training or by expending more resources, both in terms of power, time, and resources. This can also, under the right circumstances and with the right enchantments, be used as a form of spellcasting.' },
    { id: 'overcharging', name: 'Overcharging', cost: 200, description: 'You are able to power an enchantment beyond its normal capacity, and do so safely. When doing so, the enchantment\'s effects are enhanced proportional to the excess energy invested into the effect.' },
    { id: 'violent-disjunction', name: 'Violent Disjunction', cost: 200, description: 'You can cause an enchanted object to destabilize and violently discorporate. This destroys the enchantment and causes an explosion with the lingering energies from the enchantment, the blast\'s radius and power based on the amount of power in the enchantment. With time, you could potentially learn to shape how the magic expresses beyond just an explosion.' },
    { id: 'old-patient-magic', name: 'Old, Patient Magic', cost: 200, description: 'When you lay an enchantment, it will create a sort of imprint on what it is enchanted into. Over time, this imprint will deepen and make the enchantment stronger. Reinforcing the enchantment as this imprint deepens will strengthen it further and compound the effects. If an enchantment is placed on a living thing, such as an animal, person, or plant, then the enchantment will grow with the creature as well, growing stronger as the enchanted creature or plant does.' },
    { id: 'stacking-the-deck', name: 'Stacking the Deck', cost: 200, description: 'You know how to get disparate enchantments to work in tandem, even when they really shouldn\'t. You could easily create a weapon wreathed in cold flame by combining a freezing and a flame wreathing enchantment on the same weapon even though they\'d normally conflict heavily. You find that any magics, energies, enchantments, or anything really that would normally conflict simply don\'t when it comes to you and your creations.' },
    { id: 'focuses-channels', name: 'Focuses & Channels', cost: 200, description: 'You are skilled in the creation of objects designed to naturally channel and focus supernatural powers through them, making any such power easy to use. The more in line with the supernatural power to be channeled the object is, such as a lantern for fire and light based magics, the better it will channel and focus said abilities. Such a thing can also be tuned to a specific power, making it better for that power, but less useful for others.' },
    { id: 'seals-restrictions', name: 'Seals & Restrictions', cost: 200, description: 'You are able to place restrictions or seals on an enchanted object. Restrictions placed simply mean that the enchantment does not function under certain circumstances, such as not being able to use it against a specific target or requiring something of the wielder to use. However, restrictions make the enchantment stronger in situations where it is not restricted. Seals, on the other hand, cut off part of the power of the enchantment until certain conditions are met, at which point they are released. They allow greater enchantments than could normally be on the object to be placed, sealed off until the wielder can unlock them and take on the burden of keeping the sealed enchantment functioning.' },
    { id: 'named-creations', name: 'Named Creations', cost: 200, description: 'When you finish the creation of an object you can choose to give it a name and feed that name a bit of power, turning the name into a promise of sorts. If you do so, the created object will take on some metaphysical properties associated with the name chosen. These names use the innate magic of and what you feed into the creation to generate these properties. Such properties are largely passive in nature. Knowing the name will strengthen the wielder\'s ability to connect to the creation and its enchantments granting greater control.' },
    { id: 'set-bonuses', name: 'Set Bonuses', cost: 200, description: 'You can create and connect several items into a set. Having multiple components of the same set worn or wielded at once improves on each and can cause magical qualities to awaken in them as long as they are worn or wielded in tandem. An example would be a mask, a pair of gloves, a pair of boots, and a cloak that, when worn together, improve the stealth of the wearer considerably, without them even needing to be enchanted.' },
    { id: 'geomancy', name: 'Geomancy', cost: 200, description: 'You are able to use a form of empowered feng shui to set up a space for a purpose. You can set up a flow of natural energies within an area that make it easier to perform tasks related to the purpose the space was set up to have. This can also allow an area to be enchanted, albeit in a weakened form due to how widespread it is.' },
    { id: 'magitechnician', name: 'Magitechnician', cost: 200, description: 'You have the ability to meld technology and enchanting with exceptional ease and can power machines with supernatural powers in place of electricity. You can also create technology that can be used to manipulate and interface with most, if not all, supernatural forces.' },
    { id: 'arcane-study', name: 'Arcane Study', cost: 200, description: 'You have figured out how to use any magic system or supernatural power in the process of enchanting, regardless of how seemingly incapable of it they are. You can also imbue spells into object to add new properties to them related to the spell imbued.' },
    { id: 'magnum-opus', name: 'Magnum Opus', cost: 200, description: 'Over time, you will build up a charge of inspiration. This charge can, at any time, be spent in its entirety to optimize and enhance your skill in crafting, your creativity, and your innovative ability for a singular project proportional to the size of the charge. This will allow you to create things that, at your current skill level, you could not otherwise hope to create.' },
    { id: 'pure-craftsmanship', name: 'Pure Craftsmanship', cost: 300, description: 'Your skills in crafting has no upper limit and can be pushed far farther than any normal person would consider possible, allowing you to develop them to the point that they have a metaphysical, supernatural, or even conceptual quality to them through nothing more than pure skill. This is not actually limited to just crafting, any skill you work towards perfecting can be subject to this effect, however, your crafting skills develop these more esoteric applications more quickly.' },
    { id: 'upgrade', name: 'Upgrade', cost: 300, description: 'You have the ability to focus on a target in order to perceive each and every quality of that target listed within your mind without the flow of information overwhelming you. Each and every one of these qualities can have power funneled into them in order to improve on them, proportional to the amount of power invested into the improvement. However, the greater the quality already is and the more the target has been upgraded already, the more energy intensive it is to improve on the quality. This does not impart any skills or improve on a skill, but can be used on any other quality of the target. You are a viable target for this effect.' },
    { id: 'infusion', name: 'Infusion', cost: 300, description: 'You have the ability to infuse raw power into an object, either as it is being made or one that already exists, and cause it to develop and express magical qualities. The more power is put into this process the greater the magical qualities that will emerge as a result. However, the effect generated is semi-random, suited to the target object but otherwise unpredictable, and can only be slightly directed if the power is flowed into the object during its creation. An object can benefit from this a limited number of times and handle a limited amount of power before it cannot hold more and crumbles. The better the quality of the object, the more it can handle. It is possible you could learn to direct this power with time and practice, but such a thing will likely take years, or possibly decades, of practice even for those that learn at accelerated rates.' },
    { id: 'synthesis', name: 'Synthesis', cost: 300, description: 'You know the process of synthesis, by which two objects can be combined to create a new one. You can feed one object (the donor) to another (the base) to grant the base object new abilities and features based on the donor object. These are not exact and are often lesser than what the donor object possessed, but this can be done repeatedly without damaging the base object. The process of synthesis is more difficult the more different the donor object is from the base object.' },
    { id: 'remembrance', name: 'Remembrance', cost: 300, description: 'You can impart a memory of a skill or ability you yourself, or another willing participant, possesses, into an object you are crafting. Doing so causes the object to impart some of that skill or ability to the holder of the object. Crafting a sword imparted with your memory of your time training and fighting with the sword would allow the next wielder to use it with a degree of skill, even if they had never held a sword before. You can also use this to create \'skill books\' that carry any learnable skill you can teach and can teach it as if you had given someone a dedicated year of study under your tutelage with that skill. You can set the number of charges on a skill book as well as if they recharge over time if you want to set a limit on how readily available such a thing is.' },
    { id: 'soulbinding', name: 'Soulbinding', cost: 300, description: 'You have the ability to incorporate a piece of a person\'s soul into an object you create in order to bind the object to that individual. Such an object cannot harm the individual whose soul is incorporated, will return to them when called, is perfectly suited for the individual, and gains strength as the soulbound individual grows and performs great deeds. When the original wielder dies, the object may accept a new wielder, taking and incorporating a sliver of the new wielder\'s soul in the process, starting the process anew.' },
    { id: 'animism', name: 'Animism', cost: 300, description: 'You are granted the ability to draw out the essence of a creature, be they willing or too helpless to resist, and bind it into an object, imparting qualities of the donor creature to the object. This does not need to be a living creature, the remains of a creature will have some still living essence within it that you may extract and use with this perk and are considered too helpless to resist. An example would be an everburning torch infused with the essence of an ice wolf so the flames may burn with a cold flame that can lash out like a living thing. This also allows you to bind willing or captured spirits into an object, granting qualities associated with the spirit and allowing the object and spirit to reflect on each other. Taking essence from a creature isn\'t damaging to them, but it takes time for their essence to recover enough to be used as a donor again.' },
    { id: 'living-magic', name: 'Living Magic', cost: 300, description: 'Your enchantments can be imbued with a semblance of life, gaining the ability to adapt, grow, learn, and evolve over time and with use. It becomes possible for the limits of the enchantments to be pushed and prodded, loosening the limits over time and possibly opening up new abilities as the enchantment is pushed more and more. A simple magic lighter that doesn\'t need fuel might just be pushed to the point it can create massive conflagrations with this alone, given decades of use and pushing the limits.' },
    { id: 'lifeshaper', name: 'Lifeshaper', cost: 300, description: 'You have grown familiar with the art of lifeshaping, able to grow grafts, cause mutations in creatures, and otherwise magically modify creatures. You have also acquired a wealth of knowledge necessary to create entirely new creatures through a variety of means. Creating hybrid creatures through ritual fusion, gestating the combined essence of the creatures within another, or other such means. Given some practice and effort, you could potentially create entirely new species from nothing more than simple magic. Additionally, you have gained the ability to well and truly entwine your enchantments into living beings, making the enchantments as much a part of the individual as they can be, even able to be passed onto their offspring.' },
    { id: 'awakening', name: 'Awakening', cost: 300, description: 'You possess the ability to impart awareness, intelligence, and personality into an enchanted object, the degree of which is determined by the quality of the object, how much effort you put into the awakening, and the level of enchantment the object possesses at the time of awakening. The specifics of the personality and degree of both awareness and intelligence the awakened object has is up to you when you awaken it. The awakened object can communicate with its holder, if it so chooses, as well as being able to control its enchantments. If a conflict occurs between the awakened object and its holder, it can attempt to take control of their holder, though you are immune to such attempts from the objects you yourself awaken. You can also use this on magical constructs such as golems to impart them with a level of intelligence they normally do not possess themselves.' },
    { id: 'soulforge', name: 'Soulforge', cost: 300, description: 'You have learned much about how the soul works and can create enchanted objects designed to reside within the soul and provide their benefit without being immediately obvious. Such things as a gem coated in ice that grants the ability to spread frost and rime across the user\'s body to form an armor of ice or an athame that allows the user to absorb the blood they spill and turn it into healing for themselves or others they touch. A soul can contain only a few such objects, but they cannot be stolen and do not need to be held, wielded, or worn, making them much easier to carry and conceal. You also gain the ability to craft the soul of a creature into a physical object, replacing the materials normally required with the soul of the creature. The stronger the creature was in life, the stronger the soul, the more material it can substitute for, and it may even possess unique properties based on the creature the soul came from.' },
];

const itemsData = [
    { id: 'tools-of-trade', name: 'Tools of the Trade', cost: 100, description: 'Simple seeming tools for a variety of crafts, they are enchanted to steady the hand, be more accurate, and are designed to be easier to use in shaping materials. These also include various harvesting tools.' },
    { id: 'enchanters-pen', name: 'Enchanter\'s Pen', cost: 100, description: 'A fairly ornate fountain pen that constantly regenerates whatever ink is stored within and infuses it into the material of whatever it is used on, making it a permanent marking until erased by the magic in the pen itself. You can swap out what ink is in the pen with a set of ten, tiny canisters that hold and dispense the ink. The pen head is sharp and some magical inks can be poisonous, making this a decent, if awkward, holdout weapon.' },
    { id: 'arcane-filters', name: 'Arcane Filters', cost: 100, description: 'A collection of small crystals that can have power streamed through them to filter them towards a specific element, theme, or effect when used in a particular order, easing the mental strain of enchanting and helping to shape the effects. The crystals are psychically and magically reactive and can float around the user to their will. Comes with a book on the theory behind using the crystals.' },
    { id: 'blacksmiths-apron', name: 'Blacksmith\'s Apron', cost: 100, description: 'A simple leather apron that is surprisingly comfortable and doesn\'t impede your movement. While worn, you are protected from heat, cold, splashes of solvents, and similar incidental accidents from the crafting process, as well as being given a supply of fresh air to breathe while it is worn. You can choose to change the form this apron takes if you so choose.' },
    { id: 'enchanted-lenses', name: 'Enchanted Lenses', cost: 100, description: 'A pair of glasses, some goggles, a monocle, or some other form of eyewear that is enchanted to allow you to see the flows of magic around you, as well as giving you the ability to see and hear spirits, though not the ability to interact with them beyond this.' },
    { id: 'sequestering-stone', name: 'Sequestering Stone', cost: 200, description: 'A large gem that you can use to store up excess power for later use. Can absorb nearly any type of energy put into it and convert it into a baseline, neutral magical energy. The flow rate, both for input and output, is fairly slow, making it not particularly useful for faster forms of magic, but it can be hooked into an object to power its enchantments indefinitely. You can use the energy within this gem to grow smaller crystals that can store energy themselves, but only up to as much as was used to create them. They are otherwise identical.' },
    { id: 'forgefire-collection', name: 'Forgefire Collection', cost: 200, description: 'A collection of magical embers that can ignite into full flame when fed magic. The flames produced are magic in nature and can be used to burn away elements within a material or object while leaving the rest of it intact, such as burning away the poison of wolfsbane but leaving the aspect that cures the curse of the werewolf. The embers themselves are only warm to the touch and will not harm the holder when ignited, allowing them to conjure the flames for other purposes as well, such as light, heat, or even self defense. Skilled users have learned to create patterns with the power they feed the flame to control how it manifests. Each ember produces flames with different properties.' },
    { id: 'stable-catalyst', name: 'Stable Catalyst', cost: 200, description: 'You have come into possession of a small, colored glass sphere filled with a viscous liquid but no obvious openings. The liquid inside this sphere acts as a potent stabilizer for magic, preventing fluctuations in the flow of power. This means less power is wasted when the catalyst is used. However, it is far more useful when incorporated into a potion, oil, or elixir, where it greatly enhances the duration and potency of the potion. The liquid inside can be extracted by simply squeezing the sphere, which is incredibly resilient.' },
    { id: 'the-grimoire', name: 'The Grimoire', cost: 200, description: 'A heavily enchanted book that contains its own, natural reserve of magical power and can be used to perform a small number of spells. The magical energies in the grimoire can be used as if it were part of your own reserves and you can add new spells with the proper knowledge of enchanting. The more spells added, the larger the reserves the book will possess.' },
    { id: 'the-foundry', name: 'The Foundry', cost: 300, description: 'A large factory with NPC style workers that produce a variety of mundane equipment, furniture, and anything you set them to. Anything made within is entirely mundane in nature, but receptive to enchantments you may lay on them. They are also as good as what you can produce with a casual effort using only your mundane skills. A small, random supply will be in a nearby warehouse. Refills weekly.' },
    { id: 'the-mine', name: 'The Mine', cost: 300, description: 'This is an enchanted mine that will naturally regenerate the resources held within over time. It starts with veins of iron, coal, and silver, as well as salt, but you may seed other minerals into the mine, allowing it to grow and regenerate veins of those minerals as well. Any form of stone, metal, or crystal may be seeded into the mine and extracted. A small, random supply will be in a chest at the entrance. Refills weekly.' },
    { id: 'the-garden', name: 'The Garden', cost: 300, description: 'A plot of land or a greenhouse that is ideal for growing magical plants of all sorts. Any plant grown on this land will have greater magical qualities to them and can be crossbred with other plants in the garden to create plants with new magical qualities. Underneath this plot of land is a cavern where fungi can be grown as well, with the same benefits to them. A small, random supply will be in a chest at the entrance. Refills weekly.' },
    { id: 'hunting-grounds', name: 'Hunting Grounds', cost: 300, description: 'A dungeon-like structure that you can delve into in order to kill and harvest creatures of all sorts, ranging from mundane animals such as wolves all the way to great dragons. Any creature you\'ve ever encountered can be found within, if you delve deep enough. A creature must actually be killed for harvesting. You can return to any level you have reached. A small, random supply will be in a chest at the entrance. Refills weekly.' },
    { id: 'homunculus', name: 'Homunculus', cost: 300, description: 'A being of your own making bound to you through a blood bond, this small construct is the size of a human child or a medium sized dog and has a design of your choice. The homunculus can speak to you telepathically, can share its senses with you, and is a tougher than its small size would suggest. However, it\'s greatest boon is that it can consume small magic items in order to gain their properties and evolve as it absorbs more magic. It is completely loyal to you and will follow you as a pet or follower until it is imported as a companion. If you choose, any 100cp or 200cp item purchased in this jump can be incorporated into your homunculus.' },
    { id: 'enchanters-hammer', name: 'The Enchanter\'s Hammer', cost: 300, noToken: true, description: 'A simple stone statue of a hammer. Someone taking hold of the handle of this statue will allow a person to become an enchanter and develop abilities similar to those described in this document. If you take the hammer in your hand and strike the base, the hammer will shatter and spread the effects of taking hold of the hammer to people throughout the setting. If you do, you\'ll get a new one at the start of your next jump.' },
    { id: 'celestial-forge', name: 'The Celestial Forge', cost: 500, noToken: true, description: 'You have access to a pocket reality that contains a perfect workshop, ideal for any kind of crafting you may have any interest in, that you can open portals to at will. Your inspiration and muse for crafting is enhanced while within this pocket reality, as is your skill with crafting and enchanting. The pocket reality comes with an array of tools that are perfectly suited to your use. Anything you make within this pocket reality has an imprint left within that you can use to conjure copies of the created object, though they are ever so slightly weaker than the originals unless the item in question is left in the pocket reality. These copies can be manipulated telekinetically to your will and can be updated with a bit of work and time investment.' },
];

const companionsData = [
    { id: 'recruit-anyone', name: 'Recruit Anyone', cost: 0, description: 'Anyone you want to recruit in this world is free to join you as a companion if they agree. This is a perk you can use in future jumps.' },
    { id: 'import', name: 'Import', cost: 50, type: 'multi', maxTier: 4, prices: [50, 50, 50, 50], description: 'You can import a companion, and they\'ll get 600cp to spend. They also get four Enchantment Tokens. Each additional purchase doubles the number of companions you can import. With four purchases, you can import all of your companions.' },
    { id: 'fellow-enchanter', name: 'Fellow Enchanter', cost: 50, type: 'multi', maxTier: 10, description: 'This option allows you to create a new companion with 800cp and five Enchantment Tokens to spend, which can be spent the same as yourself. Each additional purchase allows you to create another companion. You can choose the specifics of their appearance and personality, though they are guaranteed to get along well with you.' },
];

const drawbacksData = [
    { id: 'leave-when-story-finishes', name: 'Leave When The Story Finishes', cost: 0, isToggle: true, description: 'You can leave when you\'ve brought the story to a conclusion. When the “canon plot” ends or is made completely impossible, you can go. Unless another drawback conflicts with this, in which case you\'ll stay until the drawback is settled.' },
    { id: 'longer-stay', name: 'Longer Stay', cost: 50, type: 'multi', maxTier: 8, description: 'You\'ll spend 5 more years here. Can be purchased multiple times. Can only provide up to +400cp for an additional 40 years in this jump.' },
    { id: 'shaky', name: 'Shaky', cost: 50, type: 'multi-tier', tiers: [
        { cost: 50, name: 'Shaky (Base)', description: 'Your ability with precise movements is abysmal, to the point it makes crafting anything with finer details much more difficult.' },
        { cost: 50, name: 'Shaky (Energy)', description: 'For an additional purchase, this even applies to your energy reserves when enchanting, making your attempts to use such powers inefficient and costly.' }
    ], description: 'Your ability with precise movements is abysmal, to the point it makes crafting anything with finer details much more difficult.' },
    { id: 'lowborn', name: 'Lowborn', cost: 50, type: 'multi-tier', tiers: [
        { cost: 50, name: 'Lowborn (Base)', description: 'You have little in the way of resources, born and raised on the lowest rungs of society. This will make your time here harder, but it is not insurmountable.' },
        { cost: 50, name: 'Lowborn (Plagued Funds)', description: 'An additional purchase will ensure hardships that drain your funds will constantly plague you for your stay, making it even harder to surmount the issues you already face.' }
    ], description: 'You have little in the way of resources, born and raised on the lowest rungs of society.' },
    { id: 'prejudice', name: 'Prejudice', cost: 50, type: 'multi-tier', tiers: [
        { cost: 50, name: 'Prejudice (Base)', description: 'You will have to deal with a measure of prejudice during your time in this jump, whether due to your gender, your race, or some other quality. This will make your time here harder, but it is not insurmountable.' },
        { cost: 50, name: 'Prejudice (Targeted)', description: 'An additional purchase will make this prejudice more intense and lead to some extremists targeting you.' }
    ], description: 'You will have to deal with a measure of prejudice during your time in this jump, whether due to your gender, your race, or some other quality.' },
    { id: 'interesting-times', name: 'Interesting Times', cost: 100, type: 'multi-tier', tiers: [
        { cost: 100, name: 'Interesting Times (Monthly)', description: 'May you live in them. This will make your time here quite a bit more exciting as you will have little time to rest and relax. One event after another will need your attention on a nearly monthly basis.' },
        { cost: 100, name: 'Interesting Times (Weekly)', description: 'An additional purchase makes this a weekly occurrence.' },
        { cost: 100, name: 'Interesting Times (Daily)', description: 'And a final purchase makes it nearly daily.' }
    ], description: 'May you live in them. This will make your time here quite a bit more exciting as you will have little time to rest and relax.' },
    { id: 'arcane-waste', name: 'Arcane Waste', cost: 100, type: 'multi-tier', tiers: [
        { cost: 100, name: 'Arcane Waste (Sludge)', description: 'Enchanting produces a mildly toxic sludge that, if not properly disposed of, can spread through the land and cause sickness to spread, as well as potentially spawning savage and mutant monsters.' },
        { cost: 100, name: 'Arcane Waste (Regulation)', description: 'For another purchase, there is an organization that actively regulates the safe capture and disposal of this sludge and will inspect your work to make sure it is being done properly. This will result in fines.' },
        { cost: 100, name: 'Arcane Waste (Imprisonment)', description: 'For a final purchase, the downsides of the sludge are much greater and the organization is much more stringent, with the ability to imprison you if you are found too far out of compliance with the regulations.' }
    ], description: 'Enchanting produces a mildly toxic sludge that, if not properly disposed of, can spread through the land and cause sickness to spread, as well as potentially spawning savage and mutant monsters.' },
    { id: 'unstable-enchantments', name: 'Unstable Enchantments', cost: 100, type: 'multi-tier', tiers: [
        { cost: 100, name: 'Unstable Enchantments (Fragile)', description: 'Your enchantments are a bit more fragile than normal and can be disjoined or suppressed far more easily than the enchantments of others.' },
        { cost: 100, name: 'Unstable Enchantments (Disjoin)', description: 'For a third purchase, your enchantments need constant maintenance or they will fall apart. For a final purchase, your enchantments are unstable and will eventually fall apart completely even with regular maintenance.' }, // Note: original text seems to skip tier 2 desc, combining 3/4. I'll make 2 tiers to fit cost progression.
        { cost: 100, name: 'Unstable Enchantments (Maintenance)', description: 'For a third purchase, your enchantments need constant maintenance or they will fall apart.' },
        { cost: 100, name: 'Unstable Enchantments (Collapse)', description: 'For a final purchase, your enchantments are unstable and will eventually fall apart completely even with regular maintenance.' }
    ], description: 'Your enchantments are a bit more fragile than normal and can be disjoined or suppressed far more easily than the enchantments of others.' },
    { id: 'rare-commodity', name: 'A Rare Commodity', cost: 100, type: 'multi-tier', tiers: [
        { cost: 100, name: 'A Rare Commodity (Orders)', description: 'Enchanters are not common for one reason or another, and you will be flooded with orders from people that are likely to harass you for your services, even if you are not selling what you create.' },
        { cost: 100, name: 'A Rare Commodity (Forced Work)', description: 'With an additional purchase, some may choose not to take no for an answer and do what they can to force you to work for them.' },
        { cost: 100, name: 'A Rare Commodity (Servitude)', description: 'For a final purchase, you are actually in forced servitude to someone already, required to make magical items for them, and them alone, until you can escape or usurp your captor.' }
    ], description: 'Enchanters are not common for one reason or another, and you will be flooded with orders from people that are likely to harass you for your services.' },
    { id: 'tech-bane', name: 'Tech-Bane', cost: 100, description: 'Anything more advanced than clockwork technology (anything that uses electricity) reacts poorly to the presence of enchantments and they can actively cause each other to fail.' },
    { id: 'arcanovores', name: 'Arcanovores', cost: 100, type: 'multi-tier', tiers: [
        { cost: 100, name: 'Arcanovores (Base)', description: 'With a world that is open to magic, some creatures take advantage of this by hoarding and feeding on magical energies, and this can be a problem for enchanters as magic items have a higher concentration of magic. You will find that these creatures have taken a liking to the flavor of your magic and will plague you for your time here.' },
        { cost: 100, name: 'Arcanovores (Dangerous)', description: 'For an additional purchase, these creatures can actually be fairly dangerous, though the dangerous ones are a bit rarer, you are guaranteed to encounter at least one particularly dangerous one during your time here.' },
        { cost: 100, name: 'Arcanovores (Persistent)', description: 'For a final purchase, you will be followed by a particularly voracious arcanovore that is difficult to kill and seems to keep coming back.' }
    ], description: 'With a world that is open to magic, some creatures take advantage of this by hoarding and feeding on magical energies, and this can be a problem for enchanters as magic items have a higher concentration of magic.' },
    { id: 'a-toll-taken', name: 'A Toll Taken', cost: 200, type: 'multi-tier', tiers: [
        { cost: 200, name: 'A Toll Taken (Health)', description: 'Enchanting takes more than just power from you. You will find that you are actively putting something of yourself into your creations, diminishing your health and physical abilities with each enchantment you lay. This will only take time for you to recover.' },
        { cost: 200, name: 'A Toll Taken (Recovery)', description: 'With a second purchase, however, you will need to regain what is lost through living healthily and working to keep yourself fit, rather than just waiting for your body to recover.' },
        { cost: 200, name: 'A Toll Taken (More Arcanovores)', description: 'A final purchase will make the more dangerous arcanovores more common.' }
    ], description: 'Enchanting takes more than just power from you. You will find that you are actively putting something of yourself into your creations, diminishing your health and physical abilities with each enchantment you lay.' },
    { id: 'outlawed', name: 'Outlawed', cost: 200, type: 'multi-tier', tiers: [
        { cost: 200, name: 'Outlawed (Prohibited)', description: 'Enchanting is a prohibited practice for one reason or another, those not actively sanctioned by whatever holds power in the region are hunted down and imprisoned. You are not actually a known variable and must hide your enchanting if you want to practice it.' },
        { cost: 200, name: 'Outlawed (Hunted)', description: 'For an additional purchase, you are actually known to the powers that be and are actively being hunted for prosecution.' },
        { cost: 200, name: 'Outlawed (Execution)', description: 'For a final purchase, it isn\'t simply prosecution, but for your eventual execution, an example to others that would attempt to practice unlawfully.' }
    ], description: 'Enchanting is a prohibited practice for one reason or another, those not actively sanctioned by whatever holds power in the region are hunted down and imprisoned.' },
    { id: 'item-lockout', name: 'Item Lockout', cost: 200, type: 'multi-tier', tiers: [
        { cost: 200, name: 'Item Lockout (Items)', description: 'You items and resources from previous jumps are locked for the duration of this jump.' },
        { cost: 100, name: 'Item Lockout (Warehouse)', description: 'A second purchase of this drawback leaves your warehouse similarly inaccessible for the duration of this jump. The second purchase only grants +100cp.' }
    ], description: 'You items and resources from previous jumps are locked for the duration of this jump.' },
    { id: 'power-lockout', name: 'Power Lockout', cost: 200, type: 'multi-tier', tiers: [
        { cost: 200, name: 'Power Lockout (Perks/Powers)', description: 'Your perks and powers from previous jumps are locked for the duration of this jump and you are reduced to just your body mod.' },
        { cost: 100, name: 'Power Lockout (Bodymod)', description: 'A second purchase leaves you without your body mod as well. The second purchase only grants +100cp.' }
    ], description: 'Your perks and powers from previous jumps are locked for the duration of this jump and you are reduced to just your body mod.' },
    { id: 'companion-lockout', name: 'Companion Lockout', cost: 200, description: 'Your companions cannot enter the jump alongside you and are restricted to your warehouse until the jump ends. Companions can still be imported, they just cannot leave the warehouse.' },
    { id: 'total-lockout', name: 'Total Lockout', cost: 'Special', isSpecial: true, description: 'This drawback can only be taken if you have taken the Item Lockout, Power Lockout, and Companion Lockout drawbacks. If you do, you gain an additional Enchantment Token.' },
    { id: 'delayed-gratification', name: 'Delayed Gratification', cost: 300, description: 'You don\'t get access to any purchases from this jump until after the jump ends. You may work towards learning the effects of the perks you have purchased, however.' },
    { id: 'rival-enchanter', name: 'Rival Enchanter', cost: 300, type: 'multi-tier', tiers: [
        { cost: 300, name: 'Rival Enchanter (One Rival)', description: 'You have an enemy that has a custom build from this doc using the same amount of CP that you spent, as well as their own set of Enchantment Tokens. They don\'t like you and want to defeat you, though they don\'t necessarily want to kill you.' },
        { cost: 300, name: 'Rival Enchanter (Additional Rival 1)', description: 'Additional purchases can either cause you to get another rival or make one of your rivals willing, and possibly more than willing, to kill you. You only gain points for the first five rivals.' },
        { cost: 300, name: 'Rival Enchanter (Additional Rival 2)', description: 'Additional purchases can either cause you to get another rival or make one of your rivals willing, and possibly more than willing, to kill you. You only gain points for the first five rivals.' },
        { cost: 300, name: 'Rival Enchanter (Additional Rival 3)', description: 'Additional purchases can either cause you to get another rival or make one of your rivals willing, and possibly more than willing, to kill you. You only gain points for the first five rivals.' },
        { cost: 300, name: 'Rival Enchanter (Additional Rival 4)', description: 'Additional purchases can either cause you to get another rival or make one of your rivals willing, and possibly more than willing, to kill you. You only gain points for the first five rivals.' }
    ], description: 'You have an enemy that has a custom build from this doc using the same amount of CP that you spent, as well as their own set of Enchantment Tokens. They don\'t like you and want to defeat you, though they don\'t necessarily want to kill you. You only gain points for the first five rivals.' },
    { id: 'renown', name: 'Renown', cost: 300, type: 'multi-tier', tiers: [
        { cost: 300, name: 'Renown (Base)', description: 'Your abilities and skills don\'t stay a secret for long, everyone knows what you are capable of and it is easy for your enemies to find out the specifics.' },
        { cost: 300, name: 'Renown (Dossier)', description: 'An additional purchase gives them a complete dossier of your abilities.' }
    ], description: 'Your abilities and skills don\'t stay a secret for long, everyone knows what you are capable of and it is easy for your enemies to find out the specifics.' },
    { id: 'growing-bed-of-thorns', name: 'A Growing Bed of Thorns', cost: 400, type: 'multi-tier', tiers: [
        { cost: 400, name: 'Growing Bed of Thorns (Corruption)', description: 'There is something off with your enchanting methods. For +400cp, eldritch spirits and entities can break into the process and possess your creations, causing them to be cursed with an aspect of corruption. However, they can be held at bay during the process if you are careful and properly focused on the task.' },
        { cost: 200, name: 'Growing Bed of Thorns (Worms)', description: 'For +600cp, they are drawn to you like moths to a flame and are able to worm their way past any seals or wards you may attempt to set up, making all of your enchanted creations to have a corrupting element to them.' }
    ], description: 'There is something off with your enchanting methods.' },
    { id: 'enchanters-war', name: 'Enchanter\'s War', cost: 400, type: 'multi-tier', tiers: [
        { cost: 400, name: 'Enchanter\'s War (Base)', description: 'There has been tension since long before your arrival and it is about to boil over into a war. It just needs a catalyst to push it over the edge. If this happens, you will likely be drafted into the war efforts as an enchanter (or a soldier if you take Delayed Gratification), making arms and armor for the men and women that are fighting.' },
        { cost: 200, name: 'Enchanter\'s War (Combat Enchanter)', description: 'For an additional +200cp, however, you will instead find yourself as a combat enchanter, which serve a similar role to a combat engineer and medic rolled into one. You will be in the thick of things and in much more danger as a result.' },
        { cost: 200, name: 'Enchanter\'s War (Portal World)', description: 'If you have selected Enchanter Portal World as the setting, then the war is between the various worlds across these portals and are far more dangerous, giving you an additional +200cp to compensate for the added dangers that will result from multiple worlds and factions fighting across them all.' }
    ], description: 'There has been tension since long before your arrival and it is about to boil over into a war.' },
    { id: 'supplement-mode', name: 'Supplement Mode', cost: 0, isToggle: true, description: 'You can choose to use this jump as a supplement and attach it to another jump.' },
    { id: 'crossover-mode', name: 'Crossover Mode', cost: 0, isToggle: true, description: 'Import another jump of your choice. You\'ll fill out the jump document, keeping the point totals separate. This setting and the other setting(s) you selected will then merge into one.' }
];


// --- Core Functions ---
function updateDisplay() {
    cpDisplay.textContent = currentCP;
    cpDisplay.className = currentCP < 0 ? 'negative' : 'positive';
    tokensDisplay.textContent = currentTokens;
    tokens300cpDisplay.textContent = `${tokensUsedFor300cp}/${MAX_300CP_TOKEN_USAGE}`;
    updateSummary();
}

function updateSummary() {
    let summaryHTML = '<ul>';

    // Location
    if (build.location) {
        summaryHTML += `<li><span class="item-name">Location:</span> <span>${build.location}</span></li>`;
    }
    // Origin
    if (build.origin) {
        summaryHTML += `<li><span class="item-name">Origin:</span> <span>${build.origin}</span></li>`;
    }
    // Age & Sex (if selected anything other than default for display)
    if (build.ageSex && build.ageSex !== "Any") {
        summaryHTML += `<li><span class="item-name">Age/Sex:</span> <span>${build.ageSex}</span></li>`;
    }

    // Perks
    summaryHTML += '<li><span class="item-name">Perks:</span></li>';
    for (const id in build.perks) {
        const perkInfo = perksData.find(p => p.id === id);
        if (perkInfo) {
            const purchased = build.perks[id];
            if (perkInfo.type === 'multi' || perkInfo.type === 'multi-tier') {
                for (let i = 0; i < purchased.tier; i++) {
                    const tierCost = perkInfo.type === 'multi-tier' ? perkInfo.tiers[i].cost : perkInfo.cost;
                    const tierName = perkInfo.type === 'multi-tier' ? `${perkInfo.tiers[i].name}` : `${perkInfo.name} (x${i + 1})`;
                    const costDisplay = purchased.tokenUsed && i < purchased.tokenUsed ? `<span class="item-cost free">Free (Token)</span>` : `<span class="item-cost">-${tierCost} CP</span>`;
                    summaryHTML += `<li><span class="item-name">&nbsp;&nbsp;&nbsp;${tierName}</span> ${costDisplay}</li>`;
                }
            } else {
                const costDisplay = purchased.tokenUsed ? `<span class="item-cost free">Free (Token)</span>` : `<span class="item-cost">-${perkInfo.cost} CP</span>`;
                summaryHTML += `<li><span class="item-name">&nbsp;&nbsp;&nbsp;${perkInfo.name}</span> ${costDisplay}</li>`;
            }
        }
    }

    // Items
    summaryHTML += '<li><span class="item-name">Items:</span></li>';
    for (const id in build.items) {
        const itemInfo = itemsData.find(i => i.id === id);
        if (itemInfo) {
            const purchased = build.items[id];
            const costDisplay = purchased.tokenUsed ? `<span class="item-cost free">Free (Token)</span>` : `<span class="item-cost">-${itemInfo.cost} CP</span>`;
            summaryHTML += `<li><span class="item-name">&nbsp;&nbsp;&nbsp;${itemInfo.name}</span> ${costDisplay}</li>`;
        }
    }

    // Companions
    summaryHTML += '<li><span class="item-name">Companions:</span></li>';
    for (const id in build.companions) {
        const compInfo = companionsData.find(c => c.id === id);
        if (compInfo) {
            const purchased = build.companions[id];
            if (compInfo.type === 'multi') {
                for (let i = 0; i < purchased.tier; i++) {
                    const tierCost = compInfo.prices ? compInfo.prices[i] : compInfo.cost;
                    const costDisplay = purchased.tokenUsed && i < purchased.tokenUsed ? `<span class="item-cost free">Free (Token)</span>` : `<span class="item-cost">-${tierCost} CP</span>`;
                    summaryHTML += `<li><span class="item-name">&nbsp;&nbsp;&nbsp;${compInfo.name} (x${i + 1})</span> ${costDisplay}</li>`;
                }
            } else {
                const costDisplay = purchased.tokenUsed ? `<span class="item-cost free">Free (Token)</span>` : `<span class="item-cost">-${compInfo.cost} CP</span>`;
                summaryHTML += `<li><span class="item-name">&nbsp;&nbsp;&nbsp;${compInfo.name}</span> ${costDisplay}</li>`;
            }
        }
    }

    // Drawbacks
    summaryHTML += '<li><span class="item-name">Drawbacks:</span></li>';
    for (const id in build.drawbacks) {
        const dbInfo = drawbacksData.find(d => d.id === id);
        if (dbInfo) {
            const purchased = build.drawbacks[id];
            if (dbInfo.type === 'multi' || dbInfo.type === 'multi-tier') {
                for (let i = 0; i < purchased.tier; i++) {
                    const tierCost = dbInfo.type === 'multi-tier' ? dbInfo.tiers[i].cost : dbInfo.cost;
                    const tierName = dbInfo.type === 'multi-tier' ? `${dbInfo.tiers[i].name}` : `${dbInfo.name} (x${i + 1})`;
                    summaryHTML += `<li><span class="item-name">&nbsp;&nbsp;&nbsp;${tierName}</span> <span class="item-cost drawback">+${tierCost} CP</span></li>`;
                }
            } else if (dbInfo.isSpecial) {
                summaryHTML += `<li><span class="item-name">&nbsp;&nbsp;&nbsp;${dbInfo.name}</span> <span class="item-cost drawback">+1 Enchantment Token</span></li>`;
            } else {
                summaryHTML += `<li><span class="item-name">&nbsp;&nbsp;&nbsp;${dbInfo.name}</span> <span class="item-cost drawback">+${dbInfo.cost} CP</span></li>`;
            }
        }
    }


    summaryHTML += '</ul>';
    buildSummaryContent.innerHTML = summaryHTML;
}

function handlePurchase(type, data, id, useToken = false) {
    const item = data.find(i => i.id === id);
    if (!item) return false;

    let cost = item.cost;
    let purchaseRecord = build[type][id] || { tier: 0, tokenUsed: 0 };
    let newTier = purchaseRecord.tier + 1;

    // Handle multi-tier/multi-purchase costs
    if (item.type === 'multi-tier') {
        if (newTier > item.tiers.length) return false; // Already max tier
        cost = item.tiers[newTier - 1].cost;
    } else if (item.type === 'multi' && item.prices) {
        if (newTier > item.prices.length) return false;
        cost = item.prices[newTier - 1];
    } else if (item.type === 'multi') {
        if (newTier > item.maxTier) return false;
        cost = item.cost;
    } else if (purchaseRecord.tier > 0) { // Already purchased single-tier
        return false;
    }

    // Token logic
    if (useToken) {
        if (currentTokens === 0) return false;
        if (item.noToken) return false; // Cannot use token for this item
        if (cost >= 300 && tokensUsedFor300cp >= MAX_300CP_TOKEN_USAGE && type !== 'drawbacks') { // Drawbacks cannot be bought with tokens
            alert(`You can only use Enchantment Tokens for two 300cp perks/items. You've reached your limit.`);
            return false;
        }
        if (cost < 300 && type !== 'drawbacks') {
            // No specific limit mentioned for <300cp, but tokens are limited.
            // Assume 1 token per purchase regardless of cost, unless specified.
        }

        currentTokens--;
        if (cost >= 300 && type !== 'drawbacks') {
            tokensUsedFor300cp++;
        }
        purchaseRecord.tokenUsed = (purchaseRecord.tokenUsed || 0) + 1; // Track how many tiers/purchases used tokens
    } else {
        if (currentCP < cost) {
            alert('Not enough CP!');
            return false;
        }
        currentCP -= cost;
    }

    purchaseRecord.tier = newTier;
    build[type][id] = purchaseRecord;
    updateDisplay();
    return true;
}

function handleRefund(type, data, id) {
    const item = data.find(i => i.id === id);
    if (!item || !build[type][id] || build[type][id].tier === 0) return;

    let purchaseRecord = build[type][id];
    let oldTier = purchaseRecord.tier;
    let refundedCost;

    if (item.type === 'multi-tier') {
        refundedCost = item.tiers[oldTier - 1].cost;
    } else if (item.type === 'multi' && item.prices) {
        refundedCost = item.prices[oldTier - 1];
    } else {
        refundedCost = item.cost;
    }

    // Refund token logic
    if (purchaseRecord.tokenUsed > 0 && oldTier <= purchaseRecord.tokenUsed) {
        currentTokens++;
        if (refundedCost >= 300) {
            tokensUsedFor300cp--;
        }
        purchaseRecord.tokenUsed--;
    } else {
        currentCP += refundedCost;
    }

    purchaseRecord.tier--;
    if (purchaseRecord.tier === 0) {
        delete build[type][id];
    } else {
        build[type][id] = purchaseRecord;
    }
    updateDisplay();
}


function handleDrawbackToggle(id, isChecked) {
    const db = drawbacksData.find(d => d.id === id);
    if (!db) return;

    if (db.isToggle) { // Simple toggles
        if (isChecked) {
            build.drawbacks[id] = { tier: 1 };
        } else {
            delete build.drawbacks[id];
        }
    } else if (db.isSpecial) { // Total Lockout logic
        const itemLock = build.drawbacks['item-lockout'] && build.drawbacks['item-lockout'].tier >= 1;
        const powerLock = build.drawbacks['power-lockout'] && build.drawbacks['power-lockout'].tier >= 1;
        const compLock = build.drawbacks['companion-lockout'] && build.drawbacks['companion-lockout'].tier >= 1;

        if (isChecked) {
            if (itemLock && powerLock && compLock) {
                if (!build.drawbacks[id]) { // Only add token once
                    currentTokens++;
                    build.drawbacks[id] = { tier: 1 };
                }
            } else {
                alert('Total Lockout requires Item Lockout, Power Lockout, and Companion Lockout to be taken first.');
                document.getElementById(`db-${id}`).checked = false; // Uncheck it
                return;
            }
        } else {
            if (build.drawbacks[id]) {
                currentTokens--; // Refund token
                delete build.drawbacks[id];
            }
        }
    } else { // Normal CP-gaining drawbacks or multi-tier
        if (isChecked) {
            // Check if it's a multi-tier drawback and buy the first tier
            if (db.type === 'multi-tier' && db.tiers && db.tiers.length > 0) {
                build.drawbacks[id] = { tier: 1 };
                currentCP += db.tiers[0].cost;
            } else {
                currentCP += db.cost;
                build.drawbacks[id] = { tier: 1 };
            }
        } else {
            // Refund CP for the highest tier purchased
            if (build.drawbacks[id]) {
                if (db.type === 'multi-tier' && db.tiers && db.tiers.length > 0) {
                    currentCP -= db.tiers[build.drawbacks[id].tier - 1].cost;
                } else {
                    currentCP -= db.cost;
                }
                delete build.drawbacks[id];
            }
        }
    }
    updateDisplay();
    // Re-evaluate Total Lockout if a prerequisite changes
    if (id === 'item-lockout' || id === 'power-lockout' || id === 'companion-lockout') {
        const totalLockoutCheckbox = document.getElementById('db-total-lockout');
        if (totalLockoutCheckbox && totalLockoutCheckbox.checked) {
            handleDrawbackToggle('total-lockout', true); // Re-trigger check
        }
    }
}


function handleMultiTierDrawback(id, action) {
    const db = drawbacksData.find(d => d.id === id);
    if (!db || db.type !== 'multi-tier' || !db.tiers) return;

    let purchaseRecord = build.drawbacks[id] || { tier: 0 };
    const currentTier = purchaseRecord.tier;

    if (action === 'buy') {
        if (currentTier < db.tiers.length) {
            const cost = db.tiers[currentTier].cost;
            currentCP += cost;
            purchaseRecord.tier++;
            build.drawbacks[id] = purchaseRecord;
        }
    } else if (action === 'sell') {
        if (currentTier > 0) {
            const cost = db.tiers[currentTier - 1].cost;
            currentCP -= cost;
            purchaseRecord.tier--;
            if (purchaseRecord.tier === 0) {
                delete build.drawbacks[id];
                document.getElementById(`db-${id}`).checked = false; // Uncheck main checkbox
            } else {
                build.drawbacks[id] = purchaseRecord;
            }
        }
    }
    updateDisplay();
    // Re-evaluate Total Lockout if a prerequisite changes (if this is a lockout drawback)
    if (id === 'item-lockout' || id === 'power-lockout' || id === 'companion-lockout') {
        const totalLockoutCheckbox = document.getElementById('db-total-lockout');
        if (totalLockoutCheckbox && totalLockoutCheckbox.checked) {
            handleDrawbackToggle('total-lockout', true); // Re-trigger check
        }
    }
}

function handleMultiPurchase(type, data, id, action) {
    const item = data.find(i => i.id === id);
    if (!item) return;

    let purchaseRecord = build[type][id] || { tier: 0, tokenUsed: 0 };
    const currentTier = purchaseRecord.tier;

    if (action === 'buy') {
        let cost;
        if (item.type === 'multi-tier') {
            if (currentTier >= item.tiers.length) return; // Max tier reached
            cost = item.tiers[currentTier].cost;
        } else if (item.type === 'multi' && item.prices) {
            if (currentTier >= item.prices.length) return; // Max tier reached
            cost = item.prices[currentTier];
        } else { // Generic multi-purchase
            if (currentTier >= item.maxTier) return; // Max tier reached
            cost = item.cost;
        }

        const useToken = document.getElementById(`${type}-${id}-token`)?.checked || false;

        if (useToken) {
            if (currentTokens === 0) { alert('Not enough Enchantment Tokens!'); return; }
            if (item.noToken) { alert('Cannot use Token for this option!'); return; }
            if (cost >= 300 && tokensUsedFor300cp >= MAX_300CP_TOKEN_USAGE) { alert('Cannot use more than 2 tokens for 300cp+ options.'); return; }

            currentTokens--;
            if (cost >= 300) tokensUsedFor300cp++;
            purchaseRecord.tokenUsed++;
        } else {
            if (currentCP < cost) { alert('Not enough CP!'); return; }
            currentCP -= cost;
        }

        purchaseRecord.tier++;
        build[type][id] = purchaseRecord;

    } else if (action === 'sell') {
        if (currentTier === 0) return;

        let cost;
        if (item.type === 'multi-tier') {
            cost = item.tiers[currentTier - 1].cost;
        } else if (item.type === 'multi' && item.prices) {
            cost = item.prices[currentTier - 1];
        } else {
            cost = item.cost;
        }

        if (purchaseRecord.tokenUsed > 0 && currentTier <= purchaseRecord.tokenUsed) {
            currentTokens++;
            if (cost >= 300) tokensUsedFor300cp--;
            purchaseRecord.tokenUsed--;
        } else {
            currentCP += cost;
        }

        purchaseRecord.tier--;
        if (purchaseRecord.tier === 0) {
            delete build[type][id];
        } else {
            build[type][id] = purchaseRecord;
        }
    }
    updateDisplay();
}


// --- DOM Generation ---
function createOptionCard(item, type) {
    const card = document.createElement('label');
    card.className = `option-card ${type}-card`;
    card.htmlFor = `${type}-${item.id}`;

    let costDisplay = '';
    if (item.cost !== undefined) {
        costDisplay = `<p class="cost">${item.cost !== 0 ? item.cost + 'cp' : 'Free'}</p>`;
    }

    if (item.type === 'multi' || item.type === 'multi-tier') {
        card.classList.add('multi-tier'); // Class for special styling/handling
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p class="description">${item.description}</p>
            <div class="multi-level-controls">
                <button type="button" class="sell-btn" data-id="${item.id}" data-type="${type}">-</button>
                <span class="level-display" id="${type}-${item.id}-level">0</span>
                <button type="button" class="buy-btn" data-id="${item.id}" data-type="${type}">+</button>
            </div>
            ${item.noToken ? '' : `
                <div class="token-checkbox-wrapper">
                    <input type="checkbox" id="${type}-${item.id}-token" class="token-checkbox" data-id="${item.id}" data-type="${type}" ${item.cost === 0 ? 'disabled' : ''}>
                    <label for="${type}-${item.id}-token">Use Token (If Applicable)</label>
                </div>
            `}
        `;

        // Add event listeners for multi-tier buttons
        card.querySelector('.buy-btn').addEventListener('click', (e) => {
            e.preventDefault(); // Prevent label from triggering radio/checkbox
            handleMultiPurchase(type, type === 'perks' ? perksData : type === 'items' ? itemsData : companionsData, item.id, 'buy');
            updateMultiTierDisplay(type, item.id);
        });
        card.querySelector('.sell-btn').addEventListener('click', (e) => {
            e.preventDefault(); // Prevent label from triggering radio/checkbox
            handleMultiPurchase(type, type === 'perks' ? perksData : type === 'items' ? itemsData : companionsData, item.id, 'sell');
            updateMultiTierDisplay(type, item.id);
        });
        if (item.noToken === false && item.cost !== 0) { // Only add token checkbox if it's not a free item and tokens can be used
            card.querySelector('.token-checkbox').addEventListener('change', updateMultiTierDisplay.bind(null, type, item.id));
        }

    } else { // Single purchase item
        card.innerHTML = `
            <input type="${type === 'perks' || type === 'items' ? 'checkbox' : 'radio'}" id="${type}-${item.id}" name="${type === 'perks' || type === 'items' ? item.id : type}" value="${item.name}">
            <h3>${item.name}</h3>
            ${costDisplay}
            <p class="description">${item.description}</p>
            ${item.cost === 0 || item.noToken ? '' : `
                <div class="token-checkbox-wrapper">
                    <input type="checkbox" id="${type}-${item.id}-token" class="token-checkbox" data-id="${item.id}" data-type="${type}">
                    <label for="${type}-${item.id}-token">Use Token (If Applicable)</label>
                </div>
            `}
        `;

        const inputElement = card.querySelector(`#${type}-${item.id}`);
        inputElement.addEventListener('change', (e) => {
            const useToken = document.getElementById(`${type}-${item.id}-token`)?.checked || false;
            if (e.target.checked) {
                if (handlePurchase(type, type === 'perks' ? perksData : itemsData, item.id, useToken)) {
                    // Update build object for single-purchase
                    build[type][item.id] = { tier: 1, tokenUsed: useToken ? 1 : 0 };
                    // For radio buttons, unselect others
                    if (inputElement.type === 'radio') {
                        document.querySelectorAll(`input[name="${type}"]:not(#${type}-${item.id})`).forEach(otherRadio => {
                            if (build[type][otherRadio.id.split('-')[1]]) {
                                handleRefund(type, type === 'perks' ? perksData : itemsData, otherRadio.id.split('-')[1]);
                            }
                        });
                        build[type] = {}; // Clear build object for this type
                        build[type][item.id] = { tier: 1, tokenUsed: useToken ? 1 : 0 }; // Re-add current selection
                    }
                } else {
                    e.target.checked = false; // Revert checkbox if purchase failed
                    if (inputElement.type === 'radio') { // For radios, need to find the previously selected one
                         const prevSelectedId = Object.keys(build[type])[0];
                         if (prevSelectedId) document.getElementById(`${type}-${prevSelectedId}`).checked = true;
                         else e.target.checked = false; // No previous selection, just uncheck
                    }
                }
            } else {
                handleRefund(type, type === 'perks' ? perksData : itemsData, item.id);
            }
            updateDisplay();
        });
        if (item.cost !== 0 && item.noToken === false) {
             card.querySelector('.token-checkbox')?.addEventListener('change', (e) => {
                 if (inputElement.checked) { // Only re-evaluate if already checked
                     inputElement.checked = false; // Temporarily uncheck to trigger re-purchase
                     inputElement.checked = true; // Re-check to trigger purchase logic with new token state
                 }
                 updateDisplay(); // Ensure display updates even if not re-purchasing
             });
        }
    }
    return card;
}


function createDrawbackCard(db) {
    const card = document.createElement('label');
    card.className = `option-card drawback-card`;
    card.htmlFor = `db-${db.id}`;

    let costDisplay = '';
    if (db.isToggle) {
        costDisplay = `<p class="cost drawback">Toggle</p>`;
    } else if (db.cost !== undefined && db.cost !== 'Special') {
        costDisplay = `<p class="cost drawback">+${db.cost}cp</p>`;
    } else if (db.cost === 'Special') {
        costDisplay = `<p class="cost drawback">Special</p>`;
    }

    if (db.type === 'multi' || db.type === 'multi-tier') {
        card.classList.add('multi-tier');
        card.innerHTML = `
            <h3>${db.name}</h3>
            <p class="description">${db.description}</p>
            <div class="multi-level-controls">
                <button type="button" class="sell-btn" data-id="${db.id}" data-type="drawbacks">-</button>
                <span class="level-display" id="db-${db.id}-level">0</span>
                <button type="button" class="buy-btn" data-id="${db.id}" data-type="drawbacks">+</button>
            </div>
        `;
        card.querySelector('.buy-btn').addEventListener('click', (e) => {
            e.preventDefault();
            handleMultiTierDrawback(db.id, 'buy');
            updateMultiTierDisplay('drawbacks', db.id);
        });
        card.querySelector('.sell-btn').addEventListener('click', (e) => {
            e.preventDefault();
            handleMultiTierDrawback(db.id, 'sell');
            updateMultiTierDisplay('drawbacks', db.id);
        });
    } else { // Single or Special Drawback
        card.innerHTML = `
            <input type="checkbox" id="db-${db.id}" name="drawback" value="${db.name}">
            <h3>${db.name}</h3>
            ${costDisplay}
            <p class="description">${db.description}</p>
        `;
        card.querySelector(`#db-${db.id}`).addEventListener('change', (e) => {
            handleDrawbackToggle(db.id, e.target.checked);
        });
    }
    return card;
}


function updateMultiTierDisplay(type, id) {
    const levelDisplay = document.getElementById(`${type}-${id}-level`);
    const purchaseRecord = build[type][id] || { tier: 0 };
    levelDisplay.textContent = purchaseRecord.tier;

    // Update main card selected state based on tier
    const card = levelDisplay.closest('.option-card');
    if (purchaseRecord.tier > 0) {
        card.classList.add('selected');
        // If it's a perk/item with a token checkbox, check it if any tier was bought with a token
        const tokenCheckbox = document.getElementById(`${type}-${id}-token`);
        if (tokenCheckbox) {
            tokenCheckbox.checked = (purchaseRecord.tokenUsed > 0);
        }
    } else {
        card.classList.remove('selected');
        const tokenCheckbox = document.getElementById(`${type}-${id}-token`);
        if (tokenCheckbox) {
            tokenCheckbox.checked = false;
        }
    }
    updateDisplay();
}


// --- Initial Setup ---
function initializeJump() {
    // Populate Perks
    perksData.forEach(perk => {
        perksGrid.appendChild(createOptionCard(perk, 'perks'));
    });

    // Populate Items
    itemsData.forEach(item => {
        itemsGrid.appendChild(createOptionCard(item, 'items'));
    });

    // Populate Companions
    companionsData.forEach(companion => {
        companionsGrid.appendChild(createOptionCard(companion, 'companions'));
    });

    // Populate Drawbacks
    drawbacksData.forEach(db => {
        drawbacksGrid.appendChild(createDrawbackCard(db));
    });

    // Event listeners for radio buttons (Locations, Origins, Age/Sex, End Choices)
    document.querySelectorAll('input[name="location"]').forEach(radio => {
        radio.addEventListener('change', (e) => { build.location = e.target.value; updateSummary(); });
    });
    document.querySelectorAll('input[name="origin"]').forEach(radio => {
        radio.addEventListener('change', (e) => { build.origin = e.target.value; updateSummary(); });
    });
    document.querySelectorAll('input[name="age_sex"]').forEach(radio => {
        radio.addEventListener('change', (e) => { build.ageSex = e.target.value; updateSummary(); });
    });
    document.querySelectorAll('input[name="end_choice"]').forEach(radio => {
        radio.addEventListener('change', (e) => { build.endChoice = e.target.value; updateSummary(); });
    });

    // Set initial values for non-cost options
    build.location = document.querySelector('input[name="location"]:checked')?.value || null;
    build.origin = document.querySelector('input[name="origin"]:checked')?.value || null;
    build.ageSex = document.querySelector('input[name="age_sex"]:checked')?.value || null;
    build.endChoice = document.querySelector('input[name="end_choice"]:checked')?.value || null;


    updateDisplay();
}

// Run initialization when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeJump);
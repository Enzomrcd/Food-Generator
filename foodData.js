// This file contains an extensive database of dishes organized by cuisine, meal type, and dietary restrictions
// The data structure allows for more sophisticated food generation algorithms

const foodData = {
    italian: {
        breakfast: {
            any: [
                { name: "Cornetto with Cappuccino", description: "A flaky, buttery Italian croissant served with a perfectly balanced cappuccino." },
                { name: "Ricotta Pancakes with Lemon", description: "Light and fluffy pancakes made with ricotta cheese and topped with lemon zest and honey." },
                { name: "Frittata di Verdure", description: "Italian open-faced omelet with seasonal vegetables, fresh herbs, and Parmesan cheese." }
            ],
            vegetarian: [
                { name: "Cornetto with Cappuccino", description: "A flaky, buttery Italian croissant served with a perfectly balanced cappuccino." },
                { name: "Ricotta Pancakes with Lemon", description: "Light and fluffy pancakes made with ricotta cheese and topped with lemon zest and honey." },
                { name: "Frittata di Verdure", description: "Italian open-faced omelet with seasonal vegetables, fresh herbs, and Parmesan cheese." }
            ],
            vegan: [
                { name: "Ciambellone", description: "Traditional vegan Italian breakfast cake flavored with citrus and olive oil." },
                { name: "Fave e Cicoria", description: "Fava bean puree with wild chicory, a traditional breakfast from Southern Italy, prepared with olive oil." },
                { name: "Chia Pudding alla Nocciola", description: "Hazelnut milk chia pudding with Italian flavor influences, topped with fresh berries." }
            ],
            "gluten-free": [
                { name: "Frittata di Verdure", description: "Italian open-faced omelet with seasonal vegetables, fresh herbs, and Parmesan cheese." },
                { name: "Polenta con Funghi", description: "Creamy polenta topped with sautéed mushrooms and fresh herbs." },
                { name: "Uova in Purgatorio", description: "Eggs poached in a spicy tomato sauce with gluten-free bread for dipping." }
            ]
        },
        lunch: {
            any: [
                { name: "Caprese Panini", description: "Rustic Italian sandwich with fresh mozzarella, tomatoes, basil, and balsamic glaze." },
                { name: "Spaghetti alla Carbonara", description: "Classic Roman pasta dish with eggs, pecorino cheese, pancetta, and black pepper." },
                { name: "Risotto ai Funghi Porcini", description: "Creamy risotto made with arborio rice and earthy porcini mushrooms." },
                { name: "Insalata di Farro", description: "Ancient grain salad with roasted vegetables, fresh herbs, and a lemon vinaigrette." }
            ],
            vegetarian: [
                { name: "Caprese Panini", description: "Rustic Italian sandwich with fresh mozzarella, tomatoes, basil, and balsamic glaze." },
                { name: "Risotto ai Funghi Porcini", description: "Creamy risotto made with arborio rice and earthy porcini mushrooms." },
                { name: "Insalata di Farro", description: "Ancient grain salad with roasted vegetables, fresh herbs, and a lemon vinaigrette." },
                { name: "Panzanella", description: "Tuscan bread salad with ripe tomatoes, cucumbers, red onions, and basil." }
            ],
            vegan: [
                { name: "Pasta al Pomodoro", description: "Simple yet delicious pasta with fresh tomato sauce, garlic, and basil." },
                { name: "Bruschetta ai Pomodori", description: "Toasted bread topped with diced tomatoes, garlic, fresh basil, and olive oil." },
                { name: "Caponata", description: "Sweet and sour Sicilian eggplant dish with celery, capers, and olives." }
            ]
        },
        dinner: {
            any: [
                { name: "Osso Buco alla Milanese", description: "Slow-cooked veal shanks in white wine and vegetables, traditionally served with gremolata." },
                { name: "Lasagna alla Bolognese", description: "Layers of pasta, rich meat ragù, béchamel sauce, and Parmigiano-Reggiano." },
                { name: "Bistecca alla Fiorentina", description: "Thick-cut T-bone steak grilled over hot coals and seasoned with olive oil, salt, and pepper." },
                { name: "Saltimbocca alla Romana", description: "Veal cutlets topped with prosciutto and sage, cooked in white wine." }
            ],
            vegetarian: [
                { name: "Melanzane alla Parmigiana", description: "Baked layers of eggplant, tomato sauce, mozzarella, and Parmesan cheese." },
                { name: "Gnocchi al Pesto", description: "Soft potato dumplings served with fresh basil pesto, pine nuts, and Parmesan cheese." },
                { name: "Risotto al Tartufo", description: "Luxurious risotto flavored with truffle oil and aged Parmesan cheese." }
            ]
        }
    },
    mexican: {
        breakfast: {
            any: [
                { name: "Huevos Rancheros", description: "Fried eggs served on warm corn tortillas topped with spicy tomato salsa, refried beans, and avocado." },
                { name: "Chilaquiles Verdes", description: "Crispy tortilla chips simmered in green salsa and topped with crema, queso fresco, and eggs." },
                { name: "Machaca con Huevo", description: "Shredded beef cooked with scrambled eggs, peppers, onions, and tomatoes." }
            ],
            vegetarian: [
                { name: "Huevos Rancheros", description: "Fried eggs served on warm corn tortillas topped with spicy tomato salsa, refried beans, and avocado." },
                { name: "Chilaquiles Verdes", description: "Crispy tortilla chips simmered in green salsa and topped with crema, queso fresco, and eggs." },
                { name: "Nopales con Huevo", description: "Scrambled eggs with tender cactus paddles, onions, tomatoes, and jalapeños." }
            ]
        },
        lunch: {
            any: [
                { name: "Tacos al Pastor", description: "Marinated pork tacos topped with pineapple, cilantro, and onion on soft corn tortillas." },
                { name: "Enchiladas Suizas", description: "Corn tortillas filled with chicken, covered in creamy green tomatillo sauce and melted cheese." },
                { name: "Chiles Rellenos", description: "Poblano peppers stuffed with cheese, battered, fried, and served in tomato sauce." }
            ],
            vegetarian: [
                { name: "Vegetarian Enfrijoladas", description: "Corn tortillas dipped in bean sauce and topped with queso fresco, avocado, and crema." },
                { name: "Chiles Rellenos", description: "Poblano peppers stuffed with cheese, battered, fried, and served in tomato sauce." },
                { name: "Quesadillas de Hongos", description: "Corn tortillas filled with mushrooms, epazote herb, and Oaxaca cheese." }
            ]
        }
    },
    asian: {
        dinner: {
            any: [
                { name: "Pad Thai", description: "Stir-fried rice noodles with eggs, tofu, bean sprouts, peanuts, and lime from Thailand." },
                { name: "Peking Duck", description: "Famous Chinese dish of crispy roasted duck served with thin pancakes, scallions, and hoisin sauce." },
                { name: "Korean Bibimbap", description: "A bowl of warm rice topped with vegetables, beef, a fried egg, and gochujang chili sauce." },
                { name: "Japanese Ramen", description: "Wheat noodles served in a flavorful broth with sliced pork, soft-boiled egg, and vegetables." }
            ],
            vegetarian: [
                { name: "Vegetable Pad Thai", description: "Stir-fried rice noodles with eggs, tofu, bean sprouts, peanuts, and lime from Thailand." },
                { name: "Buddha's Delight", description: "Chinese vegetable stir-fry with tofu, bamboo shoots, water chestnuts, and snow peas." },
                { name: "Vegetable Bibimbap", description: "A bowl of warm rice topped with assorted vegetables, a fried egg, and gochujang chili sauce." }
            ],
            vegan: [
                { name: "Vegan Pad Thai", description: "Stir-fried rice noodles with tofu, bean sprouts, peanuts, and lime from Thailand." },
                { name: "Mapo Tofu", description: "Sichuan dish of soft tofu in a spicy, aromatic sauce made with fermented black beans." },
                { name: "Vietnamese Fresh Spring Rolls", description: "Rice paper rolls filled with rice noodles, tofu, and fresh vegetables with peanut dipping sauce." }
            ]
        }
    },
    american: {
        breakfast: {
            any: [
                { name: "Classic American Breakfast", description: "Eggs, bacon, toast, and hash browns served with coffee or orange juice." },
                { name: "Buttermilk Pancakes", description: "Fluffy stack of pancakes topped with butter and maple syrup." },
                { name: "Eggs Benedict", description: "English muffin topped with Canadian bacon, poached eggs, and hollandaise sauce." }
            ],
            "low-carb": [
                { name: "Avocado and Bacon Frittata", description: "Open-faced omelet with creamy avocado, crispy bacon, and cheddar cheese." },
                { name: "Spinach and Feta Egg Cups", description: "Baked eggs with spinach, feta, and bell peppers in muffin tins." },
                { name: "Keto Breakfast Bowl", description: "Scrambled eggs with sausage, avocado, and cheese, topped with hot sauce." }
            ]
        },
        lunch: {
            any: [
                { name: "Classic Cheeseburger", description: "Juicy beef patty topped with American cheese, lettuce, tomato, and onion on a toasted bun." },
                { name: "Club Sandwich", description: "Triple-decker sandwich with turkey, bacon, lettuce, tomato, and mayo on toasted bread." },
                { name: "New England Clam Chowder", description: "Creamy soup with clams, potatoes, onions, and celery served with oyster crackers." }
            ],
            vegetarian: [
                { name: "Veggie Burger", description: "Plant-based patty with lettuce, tomato, onion, and special sauce on a whole grain bun." },
                { name: "Grilled Cheese and Tomato Soup", description: "Melted cheddar sandwich with a side of creamy tomato basil soup." },
                { name: "Cobb Salad", description: "Fresh greens topped with avocado, tomatoes, blue cheese, hard-boiled eggs, and ranch dressing." }
            ]
        }
    },
    mediterranean: {
        dinner: {
            any: [
                { name: "Greek Moussaka", description: "Layers of eggplant, spiced meat, and potatoes topped with a creamy béchamel sauce." },
                { name: "Seafood Paella", description: "Spanish rice dish with saffron, shrimp, mussels, clams, and chorizo." },
                { name: "Moroccan Tagine", description: "Slow-cooked stew with tender lamb, apricots, and aromatic spices served over couscous." }
            ],
            vegetarian: [
                { name: "Spanakopita", description: "Greek savory pie with flaky phyllo dough filled with spinach, feta cheese, and herbs." },
                { name: "Vegetable Paella", description: "Spanish rice dish with saffron, artichokes, bell peppers, and green beans." },
                { name: "Falafel Plate", description: "Crispy chickpea fritters served with hummus, tabbouleh, pickled vegetables, and warm pita." }
            ]
        }
    },
    indian: {
        lunch: {
            any: [
                { name: "Butter Chicken", description: "Tender chicken in a rich, creamy tomato sauce flavored with garam masala and fenugreek." },
                { name: "Lamb Biryani", description: "Fragrant basmati rice layered with spiced lamb, caramelized onions, and aromatic spices." },
                { name: "Chicken Tikka Masala", description: "Grilled marinated chicken in a spiced curry sauce with tomatoes and cream." }
            ],
            vegetarian: [
                { name: "Palak Paneer", description: "Indian cottage cheese in a creamy spinach sauce spiced with garam masala and cumin." },
                { name: "Chana Masala", description: "Spicy chickpea curry with tomatoes, onions, and traditional Indian spices." },
                { name: "Vegetable Biryani", description: "Fragrant basmati rice cooked with mixed vegetables, caramelized onions, and aromatic spices." }
            ],
            vegan: [
                { name: "Aloo Gobi", description: "Cauliflower and potatoes cooked with turmeric, cumin, and other spices." },
                { name: "Chana Masala", description: "Spicy chickpea curry with tomatoes, onions, and traditional Indian spices." },
                { name: "Dal Tadka", description: "Yellow lentils tempered with cumin, garlic, and dried red chilies." }
            ]
        }
    },
    filipino: {
        breakfast: {
            any: [
                { name: "Tapsilog", description: "Classic Filipino breakfast with marinated beef tapa, garlic fried rice (sinangag), and fried egg (itlog)." },
                { name: "Champorado", description: "Sweet chocolate rice porridge traditionally made with glutinous rice and tablea chocolate, often served with tuyo (dried fish)." },
                { name: "Pandesal", description: "Filipino bread rolls served with butter, cheese, or dipped in coffee." }
            ],
            vegetarian: [
                { name: "Arroz Caldo", description: "Filipino-style rice porridge with ginger, topped with tofu, green onions, and calamansi." },
                { name: "Bibingka", description: "Traditional rice cake cooked in clay pots lined with banana leaves, topped with butter and grated coconut." }
            ]
        },
        lunch: {
            any: [
                { name: "Adobo", description: "National dish of the Philippines made with meat (usually chicken or pork) marinated in vinegar, soy sauce, and garlic." },
                { name: "Sinigang", description: "Sour soup made with tamarind, various vegetables, and meat or seafood." },
                { name: "Pancit Canton", description: "Stir-fried noodles with vegetables, meat, and seafood, seasoned with calamansi and soy sauce." },
                { name: "Kare-Kare", description: "Rich Filipino stew with oxtail, vegetables, and a creamy peanut sauce, traditionally served with bagoong (shrimp paste)." }
            ],
            vegetarian: [
                { name: "Pinakbet", description: "Vegetable dish made with bitter melon, eggplant, okra, and other vegetables stewed in a vegetarian bagoong sauce." },
                { name: "Laing", description: "Taro leaves cooked in coconut milk with chili peppers, served without meat for a vegetarian version." }
            ],
            vegan: [
                { name: "Ginataang Gulay", description: "Assorted vegetables like squash, string beans, and eggplant cooked in coconut milk with garlic and onions." },
                { name: "Ensaladang Talong", description: "Filipino eggplant salad with tomatoes, onions, and a vinegar dressing." }
            ]
        },
        dinner: {
            any: [
                { name: "Lechon", description: "Whole roasted pig with crispy skin and tender meat, a centerpiece of Filipino celebrations." },
                { name: "Crispy Pata", description: "Deep-fried pork knuckle with crispy skin and tender meat, served with a soy-vinegar dipping sauce." },
                { name: "Bulalo", description: "Beef bone marrow soup with vegetables like corn, cabbage, and potatoes." },
                { name: "Sisig", description: "Sizzling dish made from parts of pig head and liver, seasoned with calamansi and chili peppers." }
            ],
            vegetarian: [
                { name: "Tortang Talong", description: "Filipino eggplant omelet where the eggplant is grilled, flattened, and dipped in egg before frying." },
                { name: "Ginisang Monggo", description: "Mung bean stew with vegetables like bitter melon, made vegetarian by omitting the usual pork." }
            ]
        },
        snack: {
            any: [
                { name: "Lumpia", description: "Filipino spring rolls filled with ground meat and vegetables, served with a sweet chili dipping sauce." },
                { name: "Siopao", description: "Steamed bun filled with pork asado or chicken." },
                { name: "Turon", description: "Sweet spring rolls filled with sliced bananas and jackfruit, coated with caramelized sugar." }
            ],
            vegetarian: [
                { name: "Bibingka Malagkit", description: "Sticky rice cake cooked in coconut milk and topped with coconut caramel sauce." },
                { name: "Palitaw", description: "Flat rice cakes coated with grated coconut, sugar, and toasted sesame seeds." }
            ],
            vegan: [
                { name: "Banana Cue", description: "Caramelized bananas coated in brown sugar and deep-fried." },
                { name: "Camote Cue", description: "Caramelized sweet potatoes coated in brown sugar and deep-fried." }
            ]
        },
        dessert: {
            any: [
                { name: "Halo-Halo", description: "Popular Filipino dessert with shaved ice, sweet beans, fruits, and jellies topped with ube ice cream and leche flan." },
                { name: "Leche Flan", description: "Filipino caramel custard made with egg yolks and condensed milk." },
                { name: "Buko Pandan", description: "Young coconut strips and pandan-flavored gelatin in sweet cream and condensed milk." }
            ],
            "dairy-free": [
                { name: "Biko", description: "Sweet rice cake made from sticky rice, coconut milk, and brown sugar." },
                { name: "Sapin-Sapin", description: "Colorful layered glutinous rice cake with coconut milk and various flavors." }
            ]
        }
    },
    // Add more cuisines, meal types, and dietary preferences as needed
};

// General dishes that can be recommended when specific combinations are not found
const generalDishes = {
    breakfast: [
        { name: "Avocado Toast with Poached Eggs", description: "Whole grain toast topped with mashed avocado, poached eggs, red pepper flakes, and microgreens." },
        { name: "Greek Yogurt Parfait", description: "Layers of creamy yogurt, fresh berries, honey, and homemade granola." },
        { name: "Breakfast Burrito", description: "Flour tortilla filled with scrambled eggs, black beans, cheese, avocado, and salsa." }
    ],
    lunch: [
        { name: "Mediterranean Bowl", description: "Quinoa topped with roasted vegetables, feta cheese, olives, and lemon-herb dressing." },
        { name: "Gourmet Grilled Cheese", description: "Artisanal bread with a blend of sharp cheddar, gruyère, and caramelized onions." },
        { name: "Poke Bowl", description: "Fresh cubed fish, rice, avocado, cucumber, and seaweed salad with a sesame-soy dressing." }
    ],
    dinner: [
        { name: "Herb-Roasted Chicken", description: "Juicy roasted chicken with lemon, garlic, and fresh herbs served with seasonal vegetables." },
        { name: "Pan-Seared Salmon", description: "Wild-caught salmon with a crispy skin served with quinoa and roasted asparagus." },
        { name: "Mushroom Risotto", description: "Creamy arborio rice slowly cooked with white wine, mushrooms, and Parmesan cheese." }
    ],
    appetizer: [
        { name: "Stuffed Mushrooms", description: "Button mushrooms filled with herbed cream cheese, garlic, and breadcrumbs." },
        { name: "Bruschetta", description: "Toasted baguette slices topped with diced tomatoes, fresh basil, garlic, and balsamic glaze." },
        { name: "Spinach Artichoke Dip", description: "Creamy dip with spinach, artichoke hearts, and a blend of cheeses served with tortilla chips." }
    ],
    dessert: [
        { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center, served with vanilla ice cream." },
        { name: "Crème Brûlée", description: "Classic French custard with a caramelized sugar crust and fresh berries." },
        { name: "Apple Crumble", description: "Baked cinnamon apples topped with a crispy oat and brown sugar topping." }
    ],
    snack: [
        { name: "Roasted Chickpeas", description: "Crispy chickpeas seasoned with smoked paprika, cumin, and sea salt." },
        { name: "Energy Bites", description: "No-bake bites made with oats, peanut butter, honey, dark chocolate, and chia seeds." },
        { name: "Homemade Trail Mix", description: "Customizable mix of nuts, dried fruits, chocolate, and whole grain cereal." }
    ],
    drink: [
        { name: "Berry Smoothie", description: "Blended mixed berries, banana, Greek yogurt, and a touch of honey." },
        { name: "Iced Matcha Latte", description: "Ceremonial grade matcha whisked with your choice of milk and sweetener over ice." },
        { name: "Cucumber Mint Refresher", description: "Sparkling water infused with fresh cucumber, mint leaves, and a squeeze of lime." }
    ]
};

// Dietary-specific general dishes
const dietaryDishes = {
    vegetarian: [
        { name: "Eggplant Parmesan", description: "Breaded eggplant slices baked with marinara sauce and melted mozzarella and Parmesan cheeses." },
        { name: "Vegetable Curry", description: "Mixed vegetables simmered in a fragrant coconut curry sauce served with basmati rice." },
        { name: "Stuffed Bell Peppers", description: "Bell peppers filled with quinoa, black beans, corn, cheese, and Southwestern spices." }
    ],
    vegan: [
        { name: "Vegan Buddha Bowl", description: "Brown rice bowl with roasted sweet potatoes, chickpeas, avocado, and tahini dressing." },
        { name: "Mushroom Walnut Bolognese", description: "Plant-based pasta sauce with a meaty texture from mushrooms and walnuts." },
        { name: "Jackfruit Tacos", description: "Seasoned jackfruit with a meat-like texture served in corn tortillas with avocado and lime." }
    ],
    "gluten-free": [
        { name: "Zucchini Noodles with Pesto", description: "Spiralized zucchini tossed with fresh basil pesto, cherry tomatoes, and pine nuts." },
        { name: "Stuffed Acorn Squash", description: "Roasted acorn squash halves filled with quinoa, cranberries, pecans, and herbs." },
        { name: "Shakshuka", description: "Eggs poached in a sauce of tomatoes, bell peppers, and spices, served with gluten-free bread." }
    ],
    "dairy-free": [
        { name: "Coconut Curry Chicken", description: "Tender chicken pieces in a rich coconut milk curry with lemongrass and Thai basil." },
        { name: "Dairy-Free Pasta Primavera", description: "Gluten-free pasta tossed with spring vegetables and a light olive oil and herb sauce." },
        { name: "Teriyaki Salmon", description: "Wild-caught salmon glazed with homemade teriyaki sauce served with steamed broccoli and rice." }
    ],
    "low-carb": [
        { name: "Cauliflower Fried Rice", description: "Riced cauliflower stir-fried with vegetables, eggs, and soy sauce." },
        { name: "Greek Chicken Lettuce Wraps", description: "Grilled lemon-herb chicken with tzatziki, tomatoes, and cucumbers in lettuce cups." },
        { name: "Zucchini Lasagna", description: "Layers of zucchini slices, ground meat, marinara sauce, and cheese baked to perfection." }
    ],
    keto: [
        { name: "Bacon-Wrapped Avocado Eggs", description: "Avocado halves filled with eggs, wrapped in bacon, and baked until crispy." },
        { name: "Keto Fathead Pizza", description: "Low-carb pizza crust made with cheese and almond flour topped with keto-friendly toppings." },
        { name: "Cheesy Chicken Alfredo Bake", description: "Chicken, broccoli, and cauliflower in a creamy cheese sauce baked until bubbly." }
    ],
    paleo: [
        { name: "Paleo Bison Chili", description: "Hearty chili made with ground bison, sweet potatoes, bell peppers, and warming spices." },
        { name: "Herb-Crusted Rack of Lamb", description: "Herb and mustard crusted lamb with roasted root vegetables." },
        { name: "Coconut Shrimp", description: "Jumbo shrimp coated in coconut flakes and almond flour, served with mango salsa." }
    ]
};

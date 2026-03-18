const products = [
    // Laptops
    {
        id: "laptop-1",
        category: "laptops",
        name: "Tuf Gaming F17",
        price: 1500,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Powerful gaming laptop with 17-inch display, high refresh rate, and dedicated graphics for an immersive gaming experience."
    },
    {
        id: "laptop-2",
        category: "laptops",
        name: "TUF Gaming F15",
        price: 2000,
        oldPrice: 2500,
        image: "https://images.unsplash.com/photo-1525547718571-03903c345358?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Compact and durable gaming laptop with high-performance specs, perfect for gaming on the go."
    },
    {
        id: "laptop-3",
        category: "laptops",
        name: "Vivo Book 15",
        price: 1800,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Sleek and stylish laptop for everyday use, featuring a vibrant display and long battery life."
    },
    {
        id: "laptop-4",
        category: "laptops",
        name: "Lenovo G14",
        price: 1500,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A reliable and efficient laptop for work and entertainment, with a comfortable keyboard and long-lasting battery."
    },
    {
        id: "laptop-5",
        category: "laptops",
        name: "Vivo Book 14",
        price: 1900,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A compact and lightweight laptop with a premium feel, perfect for productivity on the move."
    },
    {
        id: "laptop-6",
        category: "laptops",
        name: "Rog Strix G16",
        price: 1800,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A top-tier gaming laptop with a high-refresh-rate display and powerful cooling system for marathon gaming sessions."
    },
    {
        id: "laptop-7",
        category: "laptops",
        name: "Lenovo Gaming L17",
        price: 3500,
        oldPrice: 4000,
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Experience immersive gaming with this large-screen Lenovo gaming laptop, featuring a powerful processor and dedicated graphics."
    },
    {
        id: "laptop-8",
        category: "laptops",
        name: "HP Notebook G8",
        price: 800,
        oldPrice: 1000,
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A budget-friendly and reliable notebook for everyday tasks, from browsing the web to working on documents."
    },
    {
        id: "laptop-9",
        category: "laptops",
        name: "Lenovo Legion Gaming S5",
        price: 600,
        oldPrice: 800,
        image: "https://images.unsplash.com/photo-1525547718571-03903c345358?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A slim and powerful gaming laptop that doesn't compromise on performance, with a sleek design and customizable RGB lighting."
    },
    {
        id: "laptop-10",
        category: "laptops",
        name: "Asus VivoBook G12",
        price: 700,
        oldPrice: 800,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&h=300&auto=format&fit=crop",
        description: "An affordable and versatile laptop with a large display, perfect for students and home users."
    },
    {
        id: "laptop-11",
        category: "laptops",
        name: "Macbook G14",
        price: 1500,
        oldPrice: 1800,
        image: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Experience the power and elegance of a Macbook, with a stunning Retina display and all-day battery life."
    },
    {
        id: "laptop-12",
        category: "laptops",
        name: "Asus VivoBook G16",
        price: 1800,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A high-performance laptop with a large, immersive display, perfect for creative professionals and power users."
    },
    {
        id: "laptop-13",
        category: "laptops",
        name: "Rog Strix G16",
        price: 1800,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A top-tier gaming laptop with a high-refresh-rate display and powerful cooling system for marathon gaming sessions."
    },
    {
        id: "laptop-14",
        category: "laptops",
        name: "Lenovo Gaming A13",
        price: 1900,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A powerful and stylish gaming laptop with a high-refresh-rate display and customizable RGB lighting."
    },
    {
        id: "laptop-15",
        category: "laptops",
        name: "Lenovo Legion G4",
        price: 1500,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1525547718571-03903c345358?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A high-performance gaming laptop with a sleek design and powerful cooling system for optimal performance."
    },
    {
        id: "laptop-16",
        category: "laptops",
        name: "Lenovo Gaming G3",
        price: 2000,
        oldPrice: 3000,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A powerful and affordable gaming laptop with a high-refresh-rate display and dedicated graphics."
    },
    {
        id: "laptop-17",
        category: "laptops",
        name: "Lenovo Gaming G2",
        price: 1800,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A budget-friendly gaming laptop that doesn't compromise on performance, with a high-refresh-rate display and dedicated graphics."
    },
    // Phones
    {
        id: "phone-1",
        category: "phones",
        name: "iPhone 14 Pro",
        price: 1500,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&h=300&auto=format&fit=crop",
        description: "The latest iPhone with a professional-grade camera system, stunning display, and powerful performance."
    },
    {
        id: "phone-2",
        category: "phones",
        name: "iPhone 16",
        price: 2000,
        oldPrice: 2500,
        image: "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Experience the future of smartphones with the iPhone 16, featuring cutting-edge technology and design."
    },
    {
        id: "phone-3",
        category: "phones",
        name: "iPhone 12",
        price: 1900,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1556656793-062ff987b50d?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A powerful and stylish smartphone with a beautiful Super Retina XDR display and A14 Bionic chip."
    },
    {
        id: "phone-4",
        category: "phones",
        name: "iPhone 11",
        price: 1800,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A reliable and affordable iPhone with a dual-camera system and all-day battery life."
    },
    {
        id: "phone-5",
        category: "phones",
        name: "iPhone 11 Pro Max",
        price: 700,
        oldPrice: 1000,
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A large and powerful iPhone with a triple-camera system and Super Retina XDR display."
    },
    {
        id: "phone-6",
        category: "phones",
        name: "Samsung Galaxy Z20",
        price: 3000,
        oldPrice: 4500,
        image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A foldable smartphone with a large, immersive display and a versatile camera system."
    },
    {
        id: "phone-7",
        category: "phones",
        name: "Samsung Note 8",
        price: 700,
        oldPrice: 1000,
        image: "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A classic Samsung Note with a large display and S Pen for productivity and creativity."
    },
    {
        id: "phone-8",
        category: "phones",
        name: "Samsung Note 10",
        price: 1500,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1512054849369-a91fb6a6ef03?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A powerful and stylish Samsung Note with a large display and S Pen for productivity and creativity."
    },
    {
        id: "phone-9",
        category: "phones",
        name: "Samsung Galaxy S9",
        price: 600,
        oldPrice: 800,
        image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A classic Samsung Galaxy with a beautiful display and a powerful camera."
    },
    {
        id: "phone-10",
        category: "phones",
        name: "Relme C45",
        price: 800,
        oldPrice: 1200,
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A budget-friendly smartphone with a large display and long battery life."
    },
    {
        id: "phone-11",
        category: "phones",
        name: "Honor Lite 200",
        price: 500,
        oldPrice: 1000,
        image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A stylish and affordable smartphone with a large display and a capable camera."
    },
    {
        id: "phone-12",
        category: "phones",
        name: "Samsung Galaxy S25",
        price: 3000,
        oldPrice: 4000,
        image: "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?q=80&w=400&h=300&auto=format&fit=crop",
        description: "The latest Samsung Galaxy with a stunning display, a professional-grade camera system, and powerful performance."
    },
    {
        id: "phone-13",
        category: "phones",
        name: "Honor X50",
        price: 2000,
        oldPrice: 2200,
        image: "https://images.unsplash.com/photo-1512054849369-a91fb6a6ef03?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A powerful and stylish smartphone with a large display and a capable camera."
    },
    {
        id: "phone-14",
        category: "phones",
        name: "Poco X3",
        price: 1800,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A budget-friendly gaming smartphone with a high-refresh-rate display and a powerful processor."
    },
    {
        id: "phone-15",
        category: "phones",
        name: "Redmi Tab A3",
        price: 1000,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A budget-friendly tablet with a large display and long battery life."
    },
    {
        id: "phone-16",
        category: "phones",
        name: "Poco X4",
        price: 1900,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A powerful and affordable gaming smartphone with a high-refresh-rate display and a powerful processor."
    },
    {
        id: "phone-17",
        category: "phones",
        name: "iPhone XR",
        price: 900,
        oldPrice: 1500,
        image: "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A reliable and affordable iPhone with a large Liquid Retina display and all-day battery life."
    },
    {
        id: "phone-18",
        category: "phones",
        name: "Oppo A40",
        price: 2500,
        oldPrice: 3000,
        image: "https://images.unsplash.com/photo-1512054849369-a91fb6a6ef03?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A stylish and affordable smartphone with a large display and a capable camera."
    },
    {
        id: "phone-19",
        category: "phones",
        name: "Redmi S25",
        price: 2000,
        oldPrice: 2200,
        image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A powerful and stylish smartphone with a large display and a capable camera."
    },
    {
        id: "phone-20",
        category: "phones",
        name: "Vivo Y23",
        price: 1900,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A stylish and affordable smartphone with a large display and a capable camera."
    },
    {
        id: "phone-21",
        category: "phones",
        name: "Vivo Y30",
        price: 1300,
        oldPrice: 1600,
        image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A budget-friendly smartphone with a large display and long battery life."
    },
    {
        id: "phone-22",
        category: "phones",
        name: "Vivo Y40",
        price: 1900,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A stylish and affordable smartphone with a large display and a capable camera."
    },
    {
        id: "phone-23",
        category: "phones",
        name: "Vivo Y35",
        price: 1000,
        oldPrice: 1500,
        image: "https://images.unsplash.com/photo-1512054849369-a91fb6a6ef03?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A budget-friendly smartphone with a large display and long battery life."
    },
    // Watches
    {
        id: "watch-1",
        category: "watches",
        name: "Smart Watch Series 9",
        price: 1500,
        oldPrice: 2300,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Advanced smartwatch with health monitoring features, customizable watch faces, and seamless integration with your phone."
    },
    {
        id: "watch-2",
        category: "watches",
        name: "Smart Watch Ultra",
        price: 2000,
        oldPrice: 2500,
        image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A rugged and capable smartwatch for athletes and adventurers, with a large display and long battery life."
    },
    {
        id: "watch-3",
        category: "watches",
        name: "Smart Watch SE",
        price: 1000,
        oldPrice: 2300,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=400&h=300&auto=format&fit=crop",
        description: "An affordable smartwatch with all the essential features, perfect for first-time smartwatch users."
    },
    {
        id: "watch-4",
        category: "watches",
        name: "Smart Watch Nike Edition",
        price: 1500,
        oldPrice: 2300,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A special edition smartwatch designed for runners, with exclusive Nike watch faces and run-tracking features."
    },
    {
        id: "watch-5",
        category: "watches",
        name: "Smart Watch Series 8",
        price: 1800,
        oldPrice: 2200,
        image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A powerful and stylish smartwatch with advanced health sensors and a beautiful always-on display."
    },
    {
        id: "watch-6",
        category: "watches",
        name: "Smart Watch Pro",
        price: 2800,
        oldPrice: 3300,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A premium smartwatch with a classic design, advanced health monitoring, and long battery life."
    },
    {
        id: "watch-7",
        category: "watches",
        name: "Smart Watch Fit",
        price: 800,
        oldPrice: 1200,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A lightweight and comfortable smartwatch for fitness tracking, with a vibrant display and long battery life."
    },
    {
        id: "watch-8",
        category: "watches",
        name: "Smart Watch Classic",
        price: 1500,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A timeless and elegant smartwatch with a classic design and modern features."
    },
    {
        id: "watch-9",
        category: "watches",
        name: "Smart Watch Sport",
        price: 600,
        oldPrice: 1000,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A durable and water-resistant smartwatch for sports and fitness enthusiasts."
    },
    // Headphones
    {
        id: "headphone-1",
        category: "headphones",
        name: "Premium Wireless Headphone",
        price: 500,
        oldPrice: 1000,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&h=300&auto=format&fit=crop",
        description: "High-quality wireless headphones with active noise cancellation and crystal-clear audio."
    },
    {
        id: "headphone-2",
        category: "headphones",
        name: "Noise Cancelling Pro",
        price: 550,
        oldPrice: 800,
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Immerse yourself in your music with these professional-grade noise-cancelling headphones."
    },
    {
        id: "headphone-3",
        category: "headphones",
        name: "Studio Monitor Headphones",
        price: 550,
        oldPrice: 1000,
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Experience studio-quality sound with these high-fidelity monitor headphones."
    },
    {
        id: "headphone-4",
        category: "headphones",
        name: "Professional Studio Headphone",
        price: 900,
        oldPrice: 1200,
        image: "https://images.unsplash.com/photo-1583394838336-acd9929a5f91?q=80&w=400&h=300&auto=format&fit=crop",
        description: "The ultimate headphones for audio professionals, with a flat frequency response and exceptional clarity."
    },
    {
        id: "headphone-5",
        category: "headphones",
        name: "Active Bass Headphone",
        price: 1000,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Feel the beat with these powerful bass-heavy headphones, perfect for electronic music and movies."
    },
    {
        id: "headphone-6",
        category: "headphones",
        name: "Hi-Fi Audio Headphone",
        price: 1000,
        oldPrice: 3000,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Experience music the way it was meant to be heard with these high-fidelity audio headphones."
    },
    {
        id: "headphone-7",
        category: "headphones",
        name: "Compact Wireless Buds",
        price: 1000,
        oldPrice: 2300,
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Enjoy true wireless freedom with these compact and comfortable earbuds."
    },
    {
        id: "headphone-8",
        category: "headphones",
        name: "Blue Wireless Headset",
        price: 1200,
        oldPrice: 1500,
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A stylish and comfortable wireless headset with a long battery life and crystal-clear microphone."
    },
    {
        id: "headphone-9",
        category: "headphones",
        name: "Sport Green Headphone",
        price: 1300,
        oldPrice: 1500,
        image: "https://images.unsplash.com/photo-1583394838336-acd9929a5f91?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A durable and water-resistant headset for sports and fitness enthusiasts."
    },
    {
        id: "headphone-10",
        category: "headphones",
        name: "Classic Red Headphone",
        price: 1300,
        oldPrice: 1500,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A stylish and comfortable headset with a classic design and modern features."
    },
    {
        id: "headphone-11",
        category: "headphones",
        name: "Gold Edition Pro",
        price: 1500,
        oldPrice: 2300,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A premium headset with a luxurious design and high-fidelity audio."
    },
    {
        id: "headphone-12",
        category: "headphones",
        name: "Light Green Comfort",
        price: 700,
        oldPrice: 1000,
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A lightweight and comfortable headset for all-day use."
    },
    {
        id: "headphone-13",
        category: "headphones",
        name: "Deep Blue Wireless",
        price: 1700,
        oldPrice: 2200,
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A stylish and comfortable wireless headset with a long battery life and crystal-clear microphone."
    },
    {
        id: "headphone-14",
        category: "headphones",
        name: "Pastel Pink Buds",
        price: 1500,
        oldPrice: 2200,
        image: "https://images.unsplash.com/photo-1583394838336-acd9929a5f91?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Enjoy true wireless freedom with these compact and comfortable earbuds in a stylish pastel pink."
    },
    {
        id: "headphone-15",
        category: "headphones",
        name: "Gold Luxury Bass",
        price: 1200,
        oldPrice: 2200,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Experience powerful bass and luxurious comfort with these premium headphones."
    },
    {
        id: "headphone-16",
        category: "headphones",
        name: "White Sport Wireless",
        price: 1000,
        oldPrice: 2300,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A durable and water-resistant headset for sports and fitness enthusiasts."
    },
    {
        id: "headphone-17",
        category: "headphones",
        name: "Teal Active Comfort",
        price: 1100,
        oldPrice: 2300,
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A lightweight and comfortable headset for all-day use, in a stylish teal color."
    },
    {
        id: "headphone-18",
        category: "headphones",
        name: "Gray Studio Pro",
        price: 1100,
        oldPrice: 2300,
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400&h=300&auto=format&fit=crop",
        description: "The ultimate headphones for audio professionals, with a flat frequency response and exceptional clarity."
    },
    // Accessories
    {
        id: "acc-1",
        category: "accessories",
        name: "PS5 Controller",
        price: 3000,
        oldPrice: 4000,
        image: "https://images.unsplash.com/photo-1605898960764-756596f4b397?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Next-gen gaming controller for PS5, featuring haptic feedback and adaptive triggers for a more immersive experience."
    },
    {
        id: "acc-2",
        category: "accessories",
        name: "XBOX Controller",
        price: 8000,
        oldPrice: 9000,
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Experience the modernized design of the Xbox Wireless Controller, featuring sculpted surfaces and refined geometry for enhanced comfort and effortless control during gameplay."
    },
    {
        id: "acc-3",
        category: "accessories",
        name: "XBOX Controller Special",
        price: 8000,
        oldPrice: 10000,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A special edition Xbox controller with a unique design and all the features of the standard controller."
    },
    {
        id: "acc-4",
        category: "accessories",
        name: "XBOX Controller Purple",
        price: 12000,
        oldPrice: 14000,
        image: "https://images.unsplash.com/photo-1526733158173-e6b2177210cd?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A vibrant purple Xbox controller that will make your gaming setup stand out."
    },
    {
        id: "acc-5",
        category: "accessories",
        name: "AirPods Pro",
        price: 1000,
        oldPrice: 1200,
        image: "https://images.unsplash.com/photo-1588200908342-23b585c03e26?q=80&w=400&h=300&auto=format&fit=crop",
        description: "AirPods Pro feature Active Noise Cancellation for immersive sound. Transparency mode for hearing the world around you. They’re sweat and water resistant and have a customizable fit for all-day comfort."
    },
    {
        id: "acc-6",
        category: "accessories",
        name: "iPhone Premium Case",
        price: 1500,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1605898960764-756596f4b397?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A premium case for your iPhone, made from high-quality materials to protect your device from scratches and drops."
    },
    {
        id: "acc-7",
        category: "accessories",
        name: "Modern Wi-Fi 6 Router",
        price: 20000,
        oldPrice: 25000,
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=400&h=300&auto=format&fit=crop",
        description: "Experience the next generation of Wi-Fi with this powerful Wi-Fi 6 router, delivering faster speeds and more reliable connections."
    },
    {
        id: "acc-8",
        category: "accessories",
        name: "Fast Charge Power Bank",
        price: 10000,
        oldPrice: 12000,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A high-capacity power bank with fast-charging technology to keep your devices powered up on the go."
    },
    {
        id: "acc-9",
        category: "accessories",
        name: "65W GaN Charger",
        price: 12000,
        oldPrice: 15000,
        image: "https://images.unsplash.com/photo-1526733158173-e6b2177210cd?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A compact and powerful GaN charger that can charge your laptop, phone, and other devices at high speed."
    },
    {
        id: "acc-10",
        category: "accessories",
        name: "USB 3.1 Flash Drive",
        price: 1000,
        oldPrice: 1500,
        image: "https://images.unsplash.com/photo-1588200908342-23b585c03e26?q=80&w=400&h=300&auto=format&fit=crop",
        description: "A high-speed USB 3.1 flash drive for storing and transferring your files quickly and easily."
    }
];

// Helper function to get product by ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

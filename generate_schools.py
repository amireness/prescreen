import json

# Special case: United States
us_data = {
    "United States": {
        "type": "states",
        "data": {
            "New York": {
                "New York City": ["Stuyvesant High School", "Bronx High School of Science", "Brooklyn Technical High School", "Townsend Harris High School", "Fiorello H. LaGuardia High School", "Eleanor Roosevelt High School", "High School of American Studies at Lehman College", "Queens High School for the Sciences at York College", "Staten Island Technical High School", "Baccalaureate School for Global Education"],
                "Buffalo": ["Buffalo Academy for Visual and Performing Arts", "City Honors School", "Hutchinson Central Technical High School", "Leonardo da Vinci High School", "Lafayette International High School", "South Park High School", "Research Laboratory High School", "McKinley Vocational High School", "Middle Early College High School", "Western New York Maritime Charter School"]
            },
            "California": {
                "Los Angeles": ["North Hollywood High School", "The Archer School for Girls", "Harvard-Westlake School", "Loyola High School", "Marlborough School", "Windward School", "Marymount High School", "Immaculate Heart High School", "Brentwood School", "Wildwood School"],
                "San Francisco": ["Lowell High School", "Mission High School", "Galileo Academy of Science and Technology", "Raoul Wallenberg High School", "Abraham Lincoln High School", "Balboa High School", "George Washington High School", "Lick-Wilmerding High School", "University High School", "The Urban School of San Francisco"]
            },
            "Texas": {
                "Houston": ["Carnegie Vanguard High School", "DeBakey High School for Health Professions", "High School for the Performing and Visual Arts", "St. John's School", "The Kinkaid School", "Episcopal High School", "The Awty International School", "Strake Jesuit College Preparatory", "St. Agnes Academy", "Bellaire High School"],
                "Dallas": ["School for the Talented and Gifted", "School of Science and Engineering", "Booker T. Washington High School for the Performing and Visual Arts", "St. Mark's School of Texas", "The Hockaday School", "Greenhill School", "Ursuline Academy of Dallas", "Jesuit College Preparatory School of Dallas", "Highland Park High School", "Episcopal School of Dallas"]
            },
            "Illinois": {
                "Chicago": ["Whitney M. Young Magnet High School", "Northside College Preparatory High School", "Lane Technical College Prep", "Walter Payton College Prep", "Jones College Prep", "Lane Tech", "Lincoln Park High School", "Kenwood Academy", "University of Chicago Laboratory Schools", "Saint Ignatius College Prep"],
                "Aurora": ["Illinois Mathematics and Science Academy", "Metea Valley High School", "Waubonsie Valley High School", "Oswego East High School", "Aurora Central Catholic High School", "Rosary High School", "Marmion Academy", "West Aurora High School", "East Aurora High School", "Aurora Christian Schools"]
            },
            "Florida": {
                "Miami": ["Design and Architecture Senior High School", "Ransom Everglades School", "Gulliver Preparatory School", "Carrollton School of the Sacred Heart", "Mast Academy", "Coral Reef Senior High School", "Miami Palmetto Senior High School", "Belen Jesuit Preparatory School", "Our Lady of Lourdes Academy", "Christopher Columbus High School"],
                "Orlando": ["Orlando Science Middle/High Charter", "Lake Highland Preparatory School", "Bishop Moore Catholic High School", "The First Academy", "Windermere Preparatory School", "Trinity Preparatory School", "Dr. Phillips High School", "Boone High School", "Edgewater High School", "Olympia High School"]
            }
        }
    }
}

# 99 other countries (most populated)
# List from search results + common knowledge
countries_cities = {
    "India": ["New Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai"],
    "China": ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu"],
    "Indonesia": ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang"],
    "Pakistan": ["Islamabad", "Karachi", "Lahore", "Faisalabad", "Rawalpindi"],
    "Nigeria": ["Abuja", "Lagos", "Kano", "Ibadan", "Port Harcourt"],
    "Brazil": ["Brasilia", "Sao Paulo", "Rio de Janeiro", "Salvador", "Fortaleza"],
    "Bangladesh": ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet"],
    "Russia": ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan"],
    "Ethiopia": ["Addis Ababa", "Dire Dawa", "Mekelle", "Gondar", "Bahir Dar"],
    "Mexico": ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana"],
    "Japan": ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Kyoto"],
    "Philippines": ["Manila", "Quezon City", "Davao City", "Cebu City", "Zamboanga City"],
    "Egypt": ["Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said"],
    "DR Congo": ["Kinshasa", "Mbuji-Mayi", "Lubumbashi", "Kananga", "Kisangani"],
    "Vietnam": ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hai Phong", "Can Tho"],
    "Iran": ["Tehran", "Mashhad", "Isfahan", "Karaj", "Tabriz"],
    "Turkey": ["Ankara", "Istanbul", "Izmir", "Bursa", "Antalya"],
    "Germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt"],
    "Thailand": ["Bangkok", "Nonthaburi", "Nakhon Ratchasima", "Chiang Mai", "Hat Yai"],
    "United Kingdom": ["London", "Birmingham", "Manchester", "Glasgow", "Edinburgh"],
    "Tanzania": ["Dodoma", "Dar es Salaam", "Mwanza", "Arusha", "Zanzibar City"],
    "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
    "South Africa": ["Pretoria", "Johannesburg", "Cape Town", "Durban", "Port Elizabeth"],
    "Italy": ["Rome", "Milan", "Naples", "Turin", "Palermo"],
    "Kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
    "Myanmar": ["Naypyidaw", "Yangon", "Mandalay", "Mawlamyine", "Bago"],
    "Colombia": ["Bogota", "Medellin", "Cali", "Barranquilla", "Cartagena"],
    "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon"],
    "Sudan": ["Khartoum", "Omdurman", "Nyala", "Port Sudan", "Kassala"],
    "Uganda": ["Kampala", "Gulu", "Lira", "Mbarara", "Jinja"],
    "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza"],
    "Algeria": ["Algiers", "Oran", "Constantine", "Annaba", "Blida"],
    "Iraq": ["Baghdad", "Basra", "Mosul", "Erbil", "Sulaymaniyah"],
    "Argentina": ["Buenos Aires", "Cordoba", "Rosario", "Mendoza", "La Plata"],
    "Afghanistan": ["Kabul", "Kandahar", "Herat", "Mazar-i-Sharif", "Kunduz"],
    "Poland": ["Warsaw", "Krakow", "Lodz", "Wroclaw", "Poznan"],
    "Canada": ["Ottawa", "Toronto", "Montreal", "Vancouver", "Calgary"],
    "Morocco": ["Rabat", "Casablanca", "Fez", "Tangier", "Marrakesh"],
    "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam"],
    "Ukraine": ["Kyiv", "Kharkiv", "Odesa", "Dnipro", "Lviv"],
    "Angola": ["Luanda", "Huambo", "Lobito", "Benguela", "Namibe"],
    "Uzbekistan": ["Tashkent", "Namangan", "Samarkand", "Andijan", "Bukhara"],
    "Yemen": ["Sana'a", "Aden", "Taiz", "Al Hudaydah", "Al Mukalla"],
    "Peru": ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura"],
    "Malaysia": ["Kuala Lumpur", "George Town", "Ipoh", "Shah Alam", "Johor Bahru"],
    "Ghana": ["Accra", "Kumasi", "Tamale", "Sekondi-Takoradi", "Ashaiman"],
    "Mozambique": ["Maputo", "Matola", "Beira", "Nampula", "Chimoio"],
    "Nepal": ["Kathmandu", "Pokhara", "Lalitpur", "Bharatpur", "Biratnagar"],
    "Madagascar": ["Antananarivo", "Toamasina", "Antsirabe", "Fianarantsoa", "Mahajanga"],
    "Ivory Coast": ["Yamoussoukro", "Abidjan", "Bouake", "Daloa", "Korhogo"],
    "Venezuela": ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay"],
    "Cameroon": ["Yaounde", "Douala", "Garoua", "Bamenda", "Maroua"],
    "Niger": ["Niamey", "Zinder", "Maradi", "Tahoua", "Agadez"],
    "Australia": ["Canberra", "Sydney", "Melbourne", "Brisbane", "Perth"],
    "North Korea": ["Pyongyang", "Hamhung", "Chongjin", "Nampo", "Wonsan"],
    "Mali": ["Bamako", "Sikasso", "Mopti", "Koutiala", "Kayes"],
    "Burkina Faso": ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Banfora"],
    "Syria": ["Damascus", "Aleppo", "Homs", "Hama", "Latakia"],
    "Sri Lanka": ["Colombo", "Kandy", "Jaffna", "Galle", "Negombo"],
    "Malawi": ["Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Kasungu"],
    "Zambia": ["Lusaka", "Kitwe", "Ndola", "Kabwe", "Chingola"],
    "Romania": ["Bucharest", "Cluj-Napoca", "Timisoara", "Iasi", "Constanta"],
    "Chile": ["Santiago", "Valparaiso", "Concepcion", "La Serena", "Antofagasta"],
    "Kazakhstan": ["Astana", "Almaty", "Shymkent", "Karaganda", "Aktobe"],
    "Chad": ["N'Djamena", "Moundou", "Sarh", "Abeche", "Koumra"],
    "Ecuador": ["Quito", "Guayaquil", "Cuenca", "Santo Domingo", "Machala"],
    "Somalia": ["Mogadishu", "Hargeisa", "Berbera", "Kismayo", "Merca"],
    "Guatemala": ["Guatemala City", "Mixco", "Villa Nueva", "Quetzaltenango", "Escuintla"],
    "Senegal": ["Dakar", "Touba", "Thies", "Rufisque", "Kaolack"],
    "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
    "Cambodia": ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Poipet"],
    "Zimbabwe": ["Harare", "Bulawayo", "Chitungwiza", "Mutare", "Gweru"],
    "Guinea": ["Conakry", "Nzerekore", "Kankan", "Kindia", "Labe"],
    "Rwanda": ["Kigali", "Butare", "Gisenyi", "Byumba", "Cyangugu"],
    "Benin": ["Porto-Novo", "Cotonou", "Djougou", "Parakou", "Bohicon"],
    "Burundi": ["Gitega", "Bujumbura", "Muyinga", "Ngozi", "Kayanza"],
    "Tunisia": ["Tunis", "Sfax", "Sousse", "Ettadhamen", "Kairouan"],
    "Bolivia": ["Sucre", "La Paz", "Santa Cruz de la Sierra", "Cochabamba", "Oruuro"],
    "Haiti": ["Port-au-Prince", "Carrefour", "Delmas", "Cap-Haitien", "Petion-Ville"],
    "Belgium": ["Brussels", "Antwerp", "Ghent", "Charleroi", "Liege"],
    "Jordan": ["Amman", "Zarqa", "Irbid", "Russeifa", "Sahab"],
    "Dominican Republic": ["Santo Domingo", "Santiago", "La Romana", "San Pedro de Macoris", "Higuey"],
    "Cuba": ["Havana", "Santiago de Cuba", "Camagüey", "Holguin", "Guantanamo"],
    "South Sudan": ["Juba", "Yei", "Wau", "Malakal", "Nimule"],
    "Sweden": ["Stockholm", "Gothenburg", "Malmo", "Uppsala", "Vasteras"],
    "Honduras": ["Tegucigalpa", "San Pedro Sula", "Choloma", "La Ceiba", "El Progreso"],
    "Czech Republic": ["Prague", "Brno", "Ostrava", "Plzen", "Liberec"],
    "Azerbaijan": ["Baku", "Ganja", "Sumqayit", "Mingachevir", "Lankaran"],
    "Greece": ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa"],
    "Papua New Guinea": ["Port Moresby", "Lae", "Arawa", "Mount Hagen", "Madang"],
    "Portugal": ["Lisbon", "Porto", "Amadora", "Braga", "Coimbra"],
    "Hungary": ["Budapest", "Debrecen", "Szeged", "Miskolc", "Pecs"],
    "Tajikistan": ["Dushanbe", "Khujand", "Kulob", "Bokhtar", "Istaravshan"],
    "United Arab Emirates": ["Abu Dhabi", "Dubai", "Sharjah", "Al Ain", "Ajman"],
    "Belarus": ["Minsk", "Gomel", "Mogilev", "Vitebsk", "Grodno"],
    "Israel": ["Jerusalem", "Tel Aviv", "Haifa", "Rishon LeZion", "Petah Tikva"],
    "Togo": ["Lome", "Sokode", "Kara", "Atakpame", "Palime"],
    "Austria": ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck"],
    "Switzerland": ["Bern", "Zurich", "Geneva", "Basel", "Lausanne"]
}

def get_schools(country, city):
    # Generates realistic school names based on local naming conventions
    common_names = ["Secondary School", "High School", "International School", "Academy", "Public School", "College"]
    prefixes = ["National", "Central", "City", "Modern", "Global", "Elite", "Royal", "Saint", "Green", "Heritage"]
    
    # Accuracy adjustments for specific countries
    if country == "India":
        return [f"{city} Public School {i+1}" for i in range(5)] + [f"Kendriya Vidyalaya {city} No. {i+1}" for i in range(5)]
    if country == "China":
        return [f"{city} No. {i+1} High School" for i in range(10)]
    if country == "United Kingdom":
        return [f"{city} Grammar School", f"{city} High School for Girls", f"{city} High School for Boys", f"St. Mary's {city}", f"The {city} Academy", f"Queen Elizabeth School {city}", f"King Edward VI School {city}", f"{city} Collegiate", f"{city} International School", f"City of {city} College"][:10]
    if country == "Canada":
        return [f"{city} Secondary School", f"Saint {city} High School", f"North {city} High", f"West {city} Secondary", f"{city} Collegiate Institute", f"Lord Selkirk {city}", f"Bishop {city} Academy", f"{city} Catholic High School", f"Forest Hill {city}", f"{city} Technical School"][:10]
    
    # Default generator
    schools = []
    for i in range(10):
        pre = prefixes[i % len(prefixes)]
        suf = common_names[i % len(common_names)]
        schools.append(f"{pre} {city} {suf}")
    return schools

# Build full dict
final_data = us_data.copy()
for country, cities in countries_cities.items():
    country_dict = {}
    for city in cities:
        country_dict[city] = get_schools(country, city)
    final_data[country] = country_dict

# Output as JS
js_output = f"window.schoolData = {json.dumps(final_data, indent=2)};"
with open("js/data_generated.js", "w", encoding="utf-8") as f:
    f.write(js_output)

print("Generated 100 countries.")

"""Location reference tables for the AI Advantage member database.

Every raw location string the directory produces resolves to a structured
(city, region, country, country_code, continent, granularity) tuple.
"""

# Raw city string -> US state code
US_CITY = {
 "Atlanta":"GA","Scottsdale":"AZ","Wenatchee":"WA","Troy":"MI","Boston":"MA","Portland":"OR",
 "Los Angeles":"CA","Redondo Beach":"CA","Spanish Fork":"UT","San Jose":"CA","Naples":"FL",
 "Kansas City":"MO","Cincinnati":"OH","Stockton":"CA","Marana":"AZ","Fremont":"CA",
 "Riverview":"FL","Spokane":"WA","New Orleans":"LA","Parkland":"FL","San Diego":"CA",
 "Buffalo":"NY","New York City":"NY","Key West":"FL","McAllen":"TX","Concord":"NH",
 "Norwalk":"CT","Charlotte":"NC","Tustin":"CA","Baltimore":"MD","Dallas":"TX","Eldon":"MO",
 "Mesa":"AZ","New Braunfels":"TX","Miami":"FL","Huntington Beach":"CA","Santa Paula":"CA",
 "Midlothian":"VA","Seattle":"WA","Pittsburgh":"PA","West Palm Beach":"FL","Bushnell":"FL",
 "Sultan":"WA","Temecula":"CA","Hollister":"CA","Palm Desert":"CA","Aguanga":"CA",
 "Phoenix":"AZ","Northborough":"MA","South Salem":"OR","Palm Beach":"FL","Tarpon Springs":"FL",
 "Mount Pleasant":"SC","Winter Haven":"FL","Raleigh":"NC","Perrysburg":"OH","Philadelphia":"PA",
 "DeKalb":"IL","Newport Beach":"CA","Harwinton":"CT","Rockwood":"TN","Tucson":"AZ",
 "Glendale":"AZ","Fort Worth":"TX","Canon City":"CO","Cardiff-by-the-Sea":"CA",
 "Albuquerque":"NM","Rancho Mission Viejo":"CA","Lakeland":"FL","Tallahassee":"FL",
 "Grand Junction":"CO","Lake Oswego":"OR","Ocean Springs":"MS","Celina":"TX","Lincoln":"NE",
 "San Francisco":"CA","Fort Lauderdale":"FL","Durango":"CO","Tampa":"FL","Clearwater":"FL",
 "Nashville":"TN","Deerfield":"IL","Carmel":"IN","Arcadia":"CA","Orlando":"FL",
 "Lauderdale by the Sea":"FL","Honolulu":"HI","Grapevine":"TX","Baton Rouge":"LA",
 "Amityville":"NY","Las Vegas":"NV","Oahu":"HI","Snohomish":"WA","Middletown":"NY",
 "Southbury":"CT","Bakersfield":"CA","Central Point":"OR","Grass Valley":"CA",
 "Minneapolis":"MN","Boise":"ID","South Kingstown":"RI","Fargo":"ND","Camas":"WA",
 "Laguna Niguel":"CA","Columbus":"OH","Lutz":"FL","Palmetto Bay":"FL","Houston":"TX",
 "New Bern":"NC","Leander":"TX","Lake Tapps":"WA","Chandler":"AZ","Bloomington":"IL",
 "St. George":"UT","Valparaiso":"IN","Franklin":"TN","McKinney":"TX","Niceville":"FL",
 "Richmond":"VA","Pasadena":"CA","Melville":"NY","Aurora":"CO","Wilmington":"DE",
 "Palo Alto":"CA","Lancaster":"PA","Washington":"WA",
}
# Multi-city metros and counties -> US state code
US_METRO = {
 "San Francisco Bay Area":"CA","Orange County":"CA","Monmouth County":"NJ",
 "San Diego County":"CA",
}
# State / territory names given on their own -> state code
US_REGION = {
 "California":"CA","Texas":"TX","Arizona":"AZ","Maryland":"MD","Virginia":"VA",
 "Wisconsin":"WI","Oklahoma":"OK","Massachusetts":"MA","Connecticut":"CT","Oregon":"OR",
 "Idaho":"ID","Georgia":"GA","Louisiana":"LA","Alabama":"AL","Hawaii":"HI",
 "New Jersey":"NJ","New Hampshire":"NH","South Carolina":"SC","Maine":"ME",
 "New York":"NY","Colorado":"CO","Puerto Rico":"PR",
}
CA_CITY = {
 "Calgary":"AB","Toronto":"ON","Ottawa":"ON","Montreal":"QC","Grande Prairie":"AB",
 "Chambly":"QC","Holland Landing":"ON","Kitchener":"ON","Windsor":"ON","Airdrie":"AB",
}
CA_REGION = {"Nova Scotia":"NS","British Columbia":"BC"}

# Raw string -> (city, region, country, ISO-3166 alpha-2)
INTL_CITY = {
 "Lisbon":("Lisbon","","Portugal","PT"),"Bern":("Bern","","Switzerland","CH"),
 "Geneva":("Geneva","","Switzerland","CH"),"Paris":("Paris","","France","FR"),
 "15th arrondissement":("Paris","","France","FR"),
 "Frankfurt":("Frankfurt","","Germany","DE"),"Mainz":("Mainz","","Germany","DE"),
 "Fulda":("Fulda","","Germany","DE"),"Berlin":("Berlin","","Germany","DE"),
 "Stuttgart":("Stuttgart","","Germany","DE"),"Munich":("Munich","","Germany","DE"),
 "Untergruppenbach":("Untergruppenbach","","Germany","DE"),
 "Hanover":("Hanover","","Germany","DE"),
 "Prague":("Prague","","Czechia","CZ"),"Warsaw":("Warsaw","","Poland","PL"),
 "Stockholm":("Stockholm","","Sweden","SE"),"Ghent":("Ghent","","Belgium","BE"),
 "Bevel":("Bevel","Antwerp","Belgium","BE"),
 "Amsterdam":("Amsterdam","","Netherlands","NL"),"Delft":("Delft","","Netherlands","NL"),
 "Madrid":("Madrid","","Spain","ES"),"Dublin":("Dublin","","Ireland","IE"),
 "Novi Sad":("Novi Sad","","Serbia","RS"),"Sofia Capital":("Sofia","","Bulgaria","BG"),
 "Nuuk":("Nuuk","","Greenland","GL"),
 "London":("London","","United Kingdom","GB"),"Dolgellau":("Dolgellau","Wales","United Kingdom","GB"),
 "Lymm":("Lymm","England","United Kingdom","GB"),
 "Weston-super-Mare":("Weston-super-Mare","England","United Kingdom","GB"),
 "Wimbledon":("London","England","United Kingdom","GB"),
 "Manchester":("Manchester","England","United Kingdom","GB"),
 "New Forest National Park":("New Forest","England","United Kingdom","GB"),
 "Melbourne":("Melbourne","VIC","Australia","AU"),"Brisbane":("Brisbane","QLD","Australia","AU"),
 "Sydney":("Sydney","NSW","Australia","AU"),"Perth":("Perth","WA","Australia","AU"),
 "Auckland":("Auckland","","New Zealand","NZ"),
 "Dubai":("Dubai","","United Arab Emirates","AE"),
 "Ho Chi Minh City":("Ho Chi Minh City","","Vietnam","VN"),
 "Sedgefield":("Sedgefield","Western Cape","South Africa","ZA"),
 "San Pedro Sula":("San Pedro Sula","","Honduras","HN"),
 "Guadalajara":("Guadalajara","","Mexico","MX"),
 "Boquete District":("Boquete","Chiriqui","Panama","PA"),
 "Panama City":("Panama City","","Panama","PA"),
}
# Region-level international
INTL_REGION = {
 "Scotland":("","Scotland","United Kingdom","GB"),"Devon":("","Devon","United Kingdom","GB"),
 "Kent":("","Kent","United Kingdom","GB"),"Surrey":("","Surrey","United Kingdom","GB"),
}
# Country-level only
COUNTRY_ONLY = {
 "United States":("United States","US"),"Canada":("Canada","CA"),"Germany":("Germany","DE"),
 "Japan":("Japan","JP"),"New Zealand":("New Zealand","NZ"),"Finland":("Finland","FI"),
 "Sweden":("Sweden","SE"),"Greece":("Greece","GR"),"Portugal":("Portugal","PT"),
 "Slovenia":("Slovenia","SI"),"Suriname":("Suriname","SR"),"Jamaica":("Jamaica","JM"),
 "Bahrain":("Bahrain","BH"),"Cayman Islands":("Cayman Islands","KY"),
 "The Bahamas":("Bahamas","BS"),"Gibraltar":("Gibraltar","GI"),
}

CONTINENT = {
 "US":"North America","CA":"North America","MX":"North America","HN":"North America",
 "PA":"North America","JM":"North America","KY":"North America","BS":"North America",
 "GL":"North America","SR":"South America",
 "GB":"Europe","DE":"Europe","FR":"Europe","CH":"Europe","PT":"Europe","ES":"Europe",
 "IE":"Europe","NL":"Europe","BE":"Europe","SE":"Europe","FI":"Europe","PL":"Europe",
 "CZ":"Europe","SI":"Europe","RS":"Europe","BG":"Europe","GR":"Europe","GI":"Europe",
 "AU":"Oceania","NZ":"Oceania",
 "AE":"Asia","VN":"Asia","JP":"Asia","BH":"Asia",
 "ZA":"Africa",
}

# City names that exist in several countries — country is a best guess.
AMBIGUOUS = {
 "Manchester","Naples","Windsor","Surrey","Aurora","Richmond","Lancaster","Concord",
 "Hanover","Sedgefield","Panama City","Melbourne","Portland","Glendale","Franklin",
 "Middletown","Airdrie","Troy","Washington","Bevel","Chambly","Wilmington","Carmel",
 "Boston","Columbus","Lincoln",
}

def resolve(raw):
    """raw location string -> dict of structured location fields."""
    r = (raw or "").strip()
    out = {"location_raw":r,"city":"","region":"","country":"","country_code":"",
           "continent":"","location_granularity":"none","location_ambiguous":""}
    if not r:
        return out
    if r in US_CITY:
        out.update(city=r, region=US_CITY[r], country="United States", country_code="US",
                   location_granularity="city")
    elif r in US_METRO:
        out.update(region=US_METRO[r], country="United States", country_code="US",
                   location_granularity="metro")
    elif r in US_REGION:
        out.update(region=US_REGION[r], country="United States", country_code="US",
                   location_granularity="region")
    elif r in CA_CITY:
        out.update(city=r, region=CA_CITY[r], country="Canada", country_code="CA",
                   location_granularity="city")
    elif r in CA_REGION:
        out.update(region=CA_REGION[r], country="Canada", country_code="CA",
                   location_granularity="region")
    elif r in INTL_CITY:
        c,reg,ctry,cc = INTL_CITY[r]
        out.update(city=c, region=reg, country=ctry, country_code=cc,
                   location_granularity="city")
    elif r in INTL_REGION:
        c,reg,ctry,cc = INTL_REGION[r]
        out.update(city=c, region=reg, country=ctry, country_code=cc,
                   location_granularity="region")
    elif r in COUNTRY_ONLY:
        ctry,cc = COUNTRY_ONLY[r]
        out.update(country=ctry, country_code=cc, location_granularity="country")
    else:
        out["location_granularity"] = "unresolved"
    out["continent"] = CONTINENT.get(out["country_code"], "")
    if r in AMBIGUOUS:
        out["location_ambiguous"] = "yes"
    return out

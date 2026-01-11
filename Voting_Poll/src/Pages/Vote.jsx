import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SwiperCard from "../Components/SwiperCard";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { useTranslation } from "react-i18next";
import useVote from "../Hooks/useVote";

const Vote = () => {
  const { t } = useTranslation();
  const [playClick] = useSound(scifi);
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const { isLoading, error, isSuccess, castVote, hasVoted, reset } = useVote();

  const candidates = [
    {
      id: 1,
      name: t("candidates.p1.name"),
      founder: "M.G. Ramachandran",
      discription:
        "புரட்சித்தலைவர் எம்.ஜி. ராமச்சந்திரன் அவர்களால் அனைத்திந்திய அண்ணா திராவிட முன்னேற்றக் கழகம் தொடங்கப்பட்டது. அவருக்குப் பின், புரட்சித்தலைவி ஜெ. ஜெயலலிதா அவர்கள் கட்சியின் தலைமைப் பொறுப்பை ஏற்று வழிநடத்தினார்., அண்ணாயிசம் அடிப்படையிலான சமூகநீதி, சமூகநலக் கொள்கைகளை ஏற்று, பெண்கள், ஏழை மற்றும் பின்தங்கிய மக்களின் வளர்ச்சி திட்டங்களைக் கொண்டு, தமிழ்நாடு சட்டமன்றத் தேர்தலில் 7 முறை ஆட்சி அமைத்த முக்கிய அரசியல் கட்சியாகத் திகழ்கிறது.",
      year: "1972",
      promises: [
        "சமூக நீதி, சமத்துவம்",
        "ஏழை எளிய மக்களுக்கான நலத்திட்டங்கள்",
        "சத்துணவுத் திட்டம்",
        "மகளிருக்கான சிறப்புத் திட்டங்கள்",
        "அம்மா உணவகம், மினி கிளினிக்குகள், தாலிக்கு தங்கம்",
        "விவசாய கடன் தள்ளுபடி",
      ],
      tagline_en: "Makkalai Kaappom, Thamizagathai Meetpom",
      tagline_ta: "மக்களை காப்போம், தமிழகத்தை மீட்போம்",
      party: t("candidates.p1.party"),
      party_logo:
        "https://i.pinimg.com/1200x/8e/94/f8/8e94f852a6bf7bc2a3fb7918af013ff4.jpg",
      leader_img:
        "https://images.seeklogo.com/logo-png/41/1/aiadmk-logo-png_seeklogo-411321.png",
    },
    {
      id: 2,
      name: t("candidates.p2.name"),
      founder: "Vijay",
      discription:
        "தமிழக அரசியல் களத்தில் ஒரு புதிய சகாப்தத்தை உருவாக்கும் நோக்குடன் களமிறங்கியது. அம்பேத்கர், வேலு நாச்சியார், காமராஜர், பெரியார், அஞ்சலை அம்மாள் ஆகிய ஐம்பெரும் தலைவர்களின் தொலைநோக்குப் பார்வைகளை அடித்தளமாகக் கொண்டு, ஊழலற்ற, வெளிப்படையான, ஆட்சியை வழங்குவதே இதன் தலையாய லட்சியமாகும். தற்போதைய அரசியல் கட்டமைப்பிற்கு அப்பாற்பட்டு, மக்களுக்கான உண்மையான மாற்று அரசியலை நிலைநிறுத்தி, சமூக நீதி, சமத்துவம், மற்றும் தமிழக மக்களின் ஒட்டுமொத்த வளர்ச்சியை நோக்கமாகக் கொண்டு பயணிக்கும் ஒரு புதுமைக் கட்சியாகும்.",
      year: "2024",
      promises: [
        "ஊழலற்ற நேர்மையான ஆட்சி",
        "பெண்கள் பாதுகாப்பு மற்றும் அதிகாரம்",
        "அனைவருக்கும் வேலை வாய்ப்பு",
        "அரசு சேவைகளில் வெளிப்படைத்தன்மை",
        "அனைவருக்கும் தரமான கல்வி மற்றும் மருத்துவ வசதிகள்",
        "விவசாயிகள் நலன் மற்றும் கிராமப்புற வளர்ச்சி",
      ],
      tagline_en: "Pirappokkum Ellaa Uyirkkum",
      tagline_ta: "பிறப்பொக்கும் எல்லா உயிருக்கும்",
      party: t("candidates.p2.party"),
      party_logo:
        "https://i.pinimg.com/736x/ef/e0/f8/efe0f8970f04bafbb8d5f416cda2fc2f.jpg",
      leader_img:
        "https://i.pinimg.com/736x/cb/94/47/cb9447a9a518aa16563a2748f428e589.jpg",
    },
    {
      id: 3,
      name: t("candidates.p3.name"),
      founder: "C. N. Annadurai",
      discription:
        "திராவிட முன்னேற்றக் கழகம் பேரறிஞர் அண்ணாவால்  தொடங்கப்பட்டு, இந்தி எதிர்ப்பு போராட்டத்தை முன்னிறுத்தி மக்களின் பெரு ஆதரவோடு 1967யில் ஆட்சி அமைத்தது. அண்ணா , கலைஞரின் கடமை, கண்ணியம், கட்டுப்பாடு என்ற மந்திரத்தொடு சமத்துவம், சாதி ஒழிப்பு, பெண் விடுதலை போன்ற திட்டங்களை செயல்படுத்தி தமிழ்நாடு சட்டமன்றத் தேர்தலில் 6  முறை ஆட்சி அமைத்த முக்கிய அரசியல் கட்சியாகத் திகழ்கிறது. 70 ஆண்டுகளாக திராவிட சித்தாந்தத்தோடு பயணிக்கும் கட்சியாகும்.",
      year: "1949",
      promises: [
        "இட ஒதுக்கீட்டுப் பாதுகாப்பு",
        "மகளிர் உரிமைத் திட்டம்",
        "மக்களைத் தேடி மருத்துவம்",
        "பெண் கல்வி, அதிகாரம் மற்றும் பாதுகாப்பு",
        "மாநில சுயாட்சி, கூட்டாட்சித் தத்துவம்",
        "விவசாயிகள், உழைக்கும் மக்களின் வாழ்வாதார மேம்பாடு",
      ],
      tagline_en: "Kadamai, Kanniyam, Kattuppadu",
      tagline_ta: "கடமை, கன்னியம், காட்டுப்பாடு",
      party: t("candidates.p3.party"),
      party_logo:
        "https://i.pinimg.com/1200x/8d/0a/d6/8d0ad6577fd8aede3244c674ca6bfc3c.jpg",
      leader_img:
        "https://images.seeklogo.com/logo-png/41/1/dmk-logo-png_seeklogo-411320.png",
    },
    {
      id: 4,
      name: t("candidates.p4.name"),
      founder: "S. P. Adithanar",
      discription:
        "இலங்கையில் நடந்த இன அழிப்பு போரின் தாக்கத்தால், நாம் தமிழர் கட்சி இயக்கமாக தொடங்கப்பட்டு தமிழ் தேசிய சிந்தனைகளை மக்களிடம் விதைத்து. 2016யில் தேர்தல் அரசியலில் கால் பதித்து தமிழ் தேசிய சிந்தனையோடு தனித்து பயணிக்கும் கட்சியாகும்.  மீத்தேன் போராட்டம், ஸ்டெர்லைட் போராட்டம், மீனவர் போராட்டம், ஜல்லிக்கட்டு போராட்டம், ஹைட்ரோ கார்பன் போராட்டம்  போன்ற போராட்டங்களை செயல்படுத்தி  மக்களோடு மக்களாக களத்தில் நின்று தனித்து செயலாற்றும் தமிழ் தேசிய கட்சியாகும்.",
      year: "1958",
      promises: [
        "தற்சார்பு பொருளாதாரம்",
        "அனைவருக்கும் அரசு வேலை",
        "கச்சத்தீவு மீட்பு",
        "நெய்தல் படை அமைத்தல் (மீனவர் வாழ்வுரிமை பாதுகாப்பு)",
        "இயற்கை வேளாண்மை மற்றும் உணவு இறையாண்மை",
        "தமிழ் மொழிக்கு ஆட்சி மொழி அந்தஸ்து",
      ],
      tagline_en: " Uzhavai Meetpoom, Ulagai Kaappom",
      tagline_ta: " உழவை மீட்டோம் உலகை காப்போம்",
      party: t("candidates.p4.party"),
      party_logo:
        "https://i.pinimg.com/1200x/eb/05/23/eb0523f9f6be7c0bdec78f67cd9ca050.jpg",
      leader_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgEKfezxlo_XSniQNjVhAQcbF4mEFKSup5tg&s",
    },
    {
      id: 5,
      name: t("candidates.p5.name"),
      founder: " Dr. Syama Prasad Mookerjee",
      discription:
        "பாரதிய கலாச்சாரம் மற்றும் தேசிய உணர்வை முன்னிறுத்தி, தீன் தயாள் உபாத்யாயாவின் 'ஒருங்கிணைந்த மனிதநேயம்' என்ற சித்தாந்தத்தையும், 'ஒரே இந்தியா, உன்னத இந்தியா' என்ற இலக்கையும் தனது லட்சியமாகக் கொண்டுள்ளது. வளர்ச்சி (விகாஸ்), தேசிய பாதுகாப்பு, பொருளாதார மேம்பாடு, சமூக நல்லிணக்கம், அனைத்து தரப்பு மக்களின் நலன் மற்றும் ஊழலற்ற நிர்வாகம் ஆகியவற்றை தனது கொள்கைகளாகக் கொண்டு செயல்படுகிறது. தமிழகத்தில் தேசிய நீரோட்ட அரசியலை வலுப்படுத்தி, வளர்ந்த இந்தியாவை நோக்கிய பயணத்தில் தமிழ்நாட்டு மக்களின் ஆதரவைப் பெற்று பயணிக்கும் கட்சியாகும்.",
      year: "1980",
      promises: [
        "தேசிய பாதுகாப்பு, பொருளாதார மேம்பாடு",
        "சமூக நல்லிணக்கம், தமிழகத்தின் ஆன்மீகச் சுற்றுலா",
        "பாரதிய கலாச்சாரம் பாதுகாப்பு",
        "சுயசார்பு தேசத்தைக் கட்டமைத்தல்",
        "தீவிரவாதத்தை முழுமையாக ஒழித்தல்",
        "கடலோரப் பாதுகாப்பு மற்றும் மீனவர் நலன் சார்ந்த திட்டங்கள்.",
      ],
      tagline_en: "Thamizagam Thalai Nimira Tamizhanin Payanam ",
      tagline_ta: "தமிழகம் தலை நிமிர தமிழனின் பயணம்",
      party: t("candidates.p5.party"),
      party_logo:
        "https://i.pinimg.com/1200x/87/98/06/879806e54afb6170f276e63787dc10e6.jpg",
      leader_img:
        "https://i.pinimg.com/1200x/87/98/06/879806e54afb6170f276e63787dc10e6.jpg",
    },
    {
      id: 6,
      name: t("candidates.p6.name"),
      founder: "Allan Octavian Hume",
      discription:
        "இந்தியாவின் சுதந்திரப் போராட்டத்தை முன்னெடுத்த தலைமைச் சக்தியாக விளங்கியது. மகாத்மா காந்தி, ஜவஹர்லால் நேரு போன்ற தலைவர்களின் வழிகாட்டுதலில், ஜனநாயகம், சோசலிசம், சமூக நீதி மற்றும் சமத்துவம் ஆகிய கொள்கைகளைக் கொண்டுள்ளது. அனைத்துத் தரப்பு மக்களுக்கான நலத்திட்டங்கள், தொழில்துறை வளர்ச்சி போன்றவற்றை செயல்படுத்தி, இந்தியாவை ஒரு வலுவான தேசமாக கட்டியெழுப்பப் பாடுபட்டது. இன்று  மதச்சார்பற்ற ஜனநாயக விழுமியங்களையும், அரசியலமைப்புச் சட்டத்தின் மாண்புகளையும் நிலைநிறுத்தி, வலிமையான இந்தியாவை மீட்டெடுக்கும் நோக்குடன் பயணிக்கும் தேசியக் கட்சியாகும்.",
      year: "1885",
      promises: [
        "கல்வி உரிமைச் சட்டம்",
        "பசுமைப் புரட்சி",
        "பொருளாதாரச் சமத்துவம் ",
        "பன்முகத்தன்மை கொண்ட இந்தியாவைப் பாதுகாத்தல்",
        "ஏழை எளிய மக்களின் வாழ்வாதார மேம்பாடு",
        "அனைத்து குடிமக்களுக்கும் அடிப்படை உரிமைகளைப் பாதுகாத்தல்",
      ],
      tagline_en: "Vaakku Thiruttukku Ethiraaga Ondrianthu Nirppom",
      tagline_ta: "வாக்கு திருட்டுக்கு எதிராக ஒன்றிணைந்து நிற்போம்",
      party: t("candidates.p6.party"),
      party_logo:
        "https://i.pinimg.com/736x/c1/d3/cc/c1d3ccbc02c015529332ecd52fbfcc1d.jpg",
      leader_img:
        "https://i.pinimg.com/736x/ba/5a/fa/ba5afa25ea6ca1abea61b5895be253ab.jpg",
    },
    {
      id: 7,
      name: t("candidates.p7.name"),
      founder: "Thol. Thirumavalavan",
      discription:
        "ஆதி திராவிடர் மற்றும் ஒடுக்கப்பட்ட மக்களின் அரசியல், சமூக உரிமைகளுக்காகக் குரல் கொடுக்கும் முதன்மை சக்தியாக உருவெடுத்தது. அண்ணல் அம்பேத்கர், அயோத்திதாசர் பண்டிதர், மகாத்மா ஜோதிபா பூலே, பெரியார் ஆகியோரின் சிந்தனைகளைத் தனது கொள்கைகளாக ஏற்று, சாதி ஒழிப்பு, தீண்டாமை ஒழிப்பு போன்ற திட்டங்களை முன்னிறுத்தி, சமூக அநீதிக்கு எதிராகத் தொடர்ந்து போராடி, சமூகத்தின் அடித்தட்டு மக்களின் வாழ்வாதார மேம்பாட்டிற்காகவும், சுயமரியாதை மிக்க வாழ்விற்காகவும் அயராது பாடுபடும் ஒரு புரட்சிகர அரசியல் கட்சியாகத் ஆழமான தாக்கத்தை ஏற்படுத்தி பயணித்து வருகிறது.",
      year: "1982",
      promises: [
        "சாதி ஒழிப்பு  மற்றும்  சமூக சமத்துவம்",
        "பட்டியலின, பழங்குடியின, சிறுபான்மையினர் நலன் சார்ந்த சிறப்புச் சட்டங்கள்",
        "மனித உரிமைகள் பாதுகாப்பு",
        "அரசு மற்றும் தனியார் துறைகளில் இட ஒதுக்கீட்டை உறுதி செய்தல்",
        "அனைவருக்கும் கல்வி மற்றும் நிலவுரிமை",
        "பெண்களின் பாதுகாப்பு மற்றும் அதிகாரமளித்தல்",
      ],
      tagline_en: "Saathi Ozhippe Makkal Viduthalai",
      tagline_ta: "சாதி ஒழிப்பே மக்கள் விடுதலை",
      party: t("candidates.p7.party"),
      party_logo:
        "https://i.pinimg.com/1200x/98/c6/3c/98c63c764c77502b22e93746a7d79a98.jpg",
      leader_img:
        "https://i.pinimg.com/736x/8c/9e/8a/8c9e8a9c95aaed234d059791a0cb541f.jpg",
    },
    {
      id: 8,
      name: t("candidates.p8.name"),
      founder: "S. Ramadoss",
      discription:
        "வன்னியர் உள்ளிட்ட மிகவும் பிற்படுத்தப்பட்ட வகுப்பினரின் அரசியல் பிரதிநிதித்துவம் மற்றும் சமூக உரிமைகளுக்காகப் போராடும் நோக்குடன் களமிறங்கியது. சமூக நீதி, சாதி சமத்துவம், சுகாதாரம், வேளாண் வளர்ச்சி போன்ற திட்டங்களை முன்னிறுத்தி, சாதி அடிப்படையிலான பாகுபாடுகளை ஒழித்து, அனைத்து சமூகத்தினரும் சமத்துவத்துடன் வாழும் சமுதாயத்தை உருவாக்கப் பாடுபட்டு , சமூக மாற்றத்திற்கான குரலாகவும் தொடர்ந்து பயணித்து வரும் கட்சியாகும்.",
      year: "1989",
      promises: [
        "முழு மதுவிலக்கு கொள்கையை அமல்படுத்துதல்",
        "சுற்றுச்சூழல் பாதுகாப்பு மற்றும் நீர்நிலைகள் மேம்பாடு",
        "வேலைவாய்ப்பு மற்றும் திறன் மேம்பாட்டு பயிற்சி",
        "தமிழர் கலை, பண்பாடு, மொழி பாதுகாப்பு மற்றும் வளர்ச்சி",
        "சமூக நல்லிணக்கத்தை உருவாக்குதல்",
        "விவசாய விளைபொருட்களுக்கான சந்தைப்படுத்துதல்",
      ],
      tagline_en: " Anivarukkum Valarchi, Anaivarukkum Urimai",
      tagline_ta: "அனைவருக்கும் வளர்ச்சி, அனைவருக்கும் உரிமை",
      party: t("candidates.p8.party"),
      party_logo:
        "https://i.pinimg.com/736x/de/93/f3/de93f35351b928c834706c9b8aeefd66.jpg",
      leader_img:
        "https://upload.wikimedia.org/wikipedia/commons/6/67/Pmk_flag.jpg",
    },
    {
      id: 9,
      name: t("candidates.p9.name"),
      founder: "Vijayakanth",
      discription:
        "ஊழலற்ற ஆட்சி, நேர்மையான அரசியல், மக்கள் நலன் ஆகியவற்றை முன்னிறுத்தி, மாநிலத்தின் முன்னேற்றம், தமிழ் மக்களின் உரிமைகளை காக்கும் நோக்குடன் ஒரு புதிய அரசியல் பாதையை உருவாக்கும் நோக்கத்துடன் பயணித்த கட்சியாகும். மக்களின் அடிப்படைத் தேவைகள், சட்டம் ஒழுங்கு, வேலைவாய்ப்பு, சுயமரியாதை போன்ற திட்டங்களை முன்வைத்து, தமிழ்நாட்டு அரசியலில் ஒரு மாற்று சக்தியாகத் தன்னை நிலைநிறுத்திக் கொண்டு பயணிக்கும் கட்சி.",
      year: "2005",
      promises: [
        "சிறு, குறு தொழில் முனைவோர்களுக்கு நிதி உதவி",
        "தமிழ் மக்களின் உரிமைகள் பாதுகாப்பு",
        "அடிப்படைத் தேவைகள் பூர்த்தி",
        "வேலைவாய்ப்பு, சட்டம் ஒழுங்கு பராமரிப்பு",
        "வறுமை ஒழிப்பு மற்றும் ஏழை எளிய மக்கள் மேம்பாடு",
        "விவசாயிகள் நலன் மற்றும் வேளாண் வளர்ச்சி",
      ],
      tagline_en:
        " Tamizhan endru solladaa, thalai nimirnthu nilladaa, iyandrathai seivom, illaathavarkkae",
      tagline_ta:
        "தமிழன் என்று சொல்லடா, தலை நிமிர்ந்து நில்லடா, இயன்றதை செய்வோம், இல்லாதவர்க்கே!",
      party: t("candidates.p9.party"),
      party_logo:
        "https://votersverdict.com/party_img/1118412_desiya_murpokku_dravida_kazhagam_logo.webp",
      leader_img:
        "https://i.pinimg.com/1200x/40/47/9a/40479a53cc1be2c47d86a661358509da.jpg",
    },
    {
      id: 10,
      name: t("candidates.p10.name"),
      founder: "M. N. Roy",
      discription:
        "மார்க்சியம்-லெனினியம், பொதுவுடைமைச் சித்தாந்தத்தை தனது அடிப்படையாகக் கொண்டு, இந்தியாவில் விவசாயிகள், ஒடுக்கப்பட்ட மக்கள், மற்றும் உழைக்கும் வர்க்கத்தினரின் உரிமைகளுக்காகவும், சமூக நீதி, சமத்துவம், மதச்சார்பின்மை போன்ற கொள்கைகளுக்காகவும் தொடர்ந்து போராடி வருகிறது. இந்தியாவின் விடுதலைப் போராட்டத்திலும், சமூக மாற்றத்திற்காகவும் தனது பங்களிப்பைச் செலுத்தியதுடன், இந்திய அரசியலில் இடதுசாரி சித்தாந்தத்தை நிலைநிறுத்திய முன்னோடி இயக்கங்களில் ஒன்றாகவும். தமிழகத்திலும் இந்தியாவிலும் தொடர்ந்து பயணிக்கும் அரசியல் கட்சியாகும்.",
      year: "1925",
      promises: [
        "தனியார்மயமாக்கலை எதிர்த்தல் ",
        "ஏகாதிபத்திய எதிர்ப்பு",
        "விலைவாசி உயர்வு கட்டுப்பாடு",
        "ஜனநாயக உரிமைகள் பாதுகாப்பு",
        "தொழிலாளர் சங்க உரிமைகள்",
        "சமூக அநீதிக்கு எதிராகக் குரல்",
      ],
      tagline_en: "Workers of the world, unite!",
      tagline_ta: "உலகத் தொழிலாளர்களே, ஒன்றுபடுங்கள்!",
      party: t("candidates.p10.party"),
      party_logo:
        "https://i.pinimg.com/736x/93/62/df/9362dfd674d8308e4414278642c5f65b.jpg",
      leader_img:
        "https://i.pinimg.com/736x/93/62/df/9362dfd674d8308e4414278642c5f65b.jpg",
    },
    {
      id: 11,
      name: t("candidates.p11.name"),
      founder: "T. T. V. Dhinakaran",
      discription:
        "புரட்சித்தலைவி அம்மா ஜெ. ஜெயலலிதா அவர்களின் மக்கள் நல அரசியல் சிந்தனைகளையும், திராவிட இயக்கத்தின் அடிப்படை கொள்கைகளையும் மீட்டெடுத்து நடைமுறைப்படுத்தும் நோக்குடன் உருவான அரசியல் கட்சி.  தமிழ்நாட்டு மக்களின் உரிமைகளைப் பாதுகாப்பது, ஊழலற்ற நிர்வாகத்தை உறுதி செய்வது போன்ற முக்கிய இலக்குகளாகக் கொண்டு செயல்படுகிறது.  அம்மாவின் ஆட்சியில் வெற்றிகரமாக செயல்படுத்தப்பட்ட ஏழை, எளிய மற்றும் நடுத்தர மக்களுக்கான நலத்திட்டங்களை மறுமலர்ச்சி செய்து, மக்கள் மைய அரசியலை வலுப்படுத்தி, அதிமுகவின் உண்மையான தொண்டர்களின் குரலாக பயணித்து வருகிறது",
      year: "2018",
      promises: [
        "விவசாயிகள் மற்றும் தொழிலாளர்களின் வாழ்வாதாரத்தை மேம்படுத்துதல்.",
        "சட்டம் ஒழுங்கு பராமரிப்பு",
        "பொருளாதாரச் சமத்துவத்தை ஏற்படுத்துதல்.",
        "மக்கள் நலத் திட்டங்களை மறுமலர்ச்சி செய்தல்.",
        "பெண்கள் மற்றும் இளைஞர்களுக்கு அதிகாரமளித்தல்.",
        "மக்கள் குறைகளை நிவர்த்தி செய்ய புதிய வழிமுறைகள்.",
      ],
      tagline_en: "Thamizagam Thalai Nimirattum, Tamizhar Vaazhvu Malarattum ",
      tagline_ta: "தமிழகம் தலை நிமிரட்டும், தமிழர் வாழ்வு மலரட்டும்",
      party: t("candidates.p11.party"),
      party_logo:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJsd14m-3naYxXQ406pta-yUOcoXzXaX5cwA&s",
      leader_img:
        "https://upload.wikimedia.org/wikipedia/commons/c/c5/Flag_AMMK.jpg",
    },
    {
      id: 12,
      name: t("candidates.p12.name"),
      founder: " T. Velmurugan",
      discription:
        "தமிழினத்தின் தனித்துவம், மொழி, நிலம், நீர், வாழ்வுரிமை ஆகியவற்றை முதன்மைப்படுத்தி, தமிழகத்தின் உரிமைகளை மீட்டெடுப்பதற்கான போராட்டங்களை முன்னெடுத்தது. திராவிட இயக்கங்கள் மற்றும் தேசியக் கட்சிகளுக்கு மத்தியில் தமிழர்களுக்கான குரலாக ஒலித்து, தமிழக நலன்களையும், உரிமைகளையும் நிலைநாட்டும் நோக்கத்துடன் தமிழக அரசியலில் ஒரு போராடும் சக்தியாகத் தொடர்ந்து பயணிக்கும் கட்சியாகும்.",
      year: "2012",
      promises: [
        "நதிநீர் உரிமைப் பாதுகாப்பு",
        "மீனவர் வாழ்வுரிமைப் பாதுகாப்பு",
        "தமிழர் நில உரிமைப் பாதுகாப்பு",
        "இயற்கை வளங்கள் பாதுகாப்பு",
        "தமிழ்நாட்டில் உள்ள வேலைவாய்ப்புகளில் தமிழர்களுக்கு சட்டபூர்வ முன்னுரிமை",
        "கச்சத்தீவு உட்பட கடல் எல்லை உரிமைகள் பாதுகாப்பு",
      ],
      tagline_en: "Urimai Meetchiye, Inaththin Eazhuchi ",
      tagline_ta: "உரிமை மீட்சியே, இனத்தின் எழுச்சி",
      party: t("candidates.p12.party"),
      party_logo:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjLGPO2H742nhN27pR1xCrpDJb8EHmpUdpg&s",
      leader_img:
        "https://prime9tamil.com/wp-content/uploads/2025/05/tvk-velmurugan.jpg",
    },
    {
      id: 13,
      name: t("candidates.p13.name"),
      founder: "P. Ramamurthi",
      discription:
        "இந்திய கம்யூனிஸ்ட் கட்சியிலிருந்து பிரிந்து தோற்றுவிக்கப்பட்ட மார்க்சிஸ்ட் கம்யூனிஸ்ட் கட்சி, மார்க்சிய-லெனினிய சித்தாந்தத்தை தனது வழிகாட்டியாகக் கொண்டு, இந்தியாவில் முதலாளித்துவ சுரண்டலுக்கும், ஏகாதிபத்திய சக்திகளின் தலையீட்டிற்கும் எதிராகவும், ஏழை எளிய மக்களின் நலன் மற்றும் உரிமைகளுக்காகவும் தொடர்ந்து போராடி வருகிறது. சமூக நீதி, சமத்துவம் ஆகியவற்றை நிலைநிறுத்தவும், சுரண்டலற்ற சோசலிச சமூகத்தை நோக்கிய பயணத்திற்காகவும் தொடர்ந்து போராடி, தமிழகத்திலும் இந்திய அளவிலும் தனது தனித்தன்மையுடன் பயணிக்கும் வலுவான இடதுசாரி அரசியல் கட்சியாகும்.",
      year: "1964",
      promises: [
        "மாநில உரிமைகள் மற்றும் கூட்டாட்சி தத்துவம்",
        "அனைவருக்கும் சம வாய்ப்பு",
        "தொழிற்சங்க வலுப்படுத்தல்",
        "உழைக்கும் வர்க்க உரிமைகள்",
        "சமூக சமத்துவத்துக்கான சட்டப் போராட்டம்",
        "சாதிய, மத, பாலின பாகுபாடு ஒழிப்பு",
      ],
      tagline_en:
        " Anaivarukkum Samathuvathum Neethiyayum Oruthi Seivatharkkanaa Ore Paathai",
      tagline_ta:
        "அனைவருக்கும் சமத்துவத்தும் நீதியும் ஒருச்சென்று செய்வதற்கான ஒரே பாதை",
      party: t("candidates.p13.party"),
      party_logo:
        "https://www.globalsecurity.org/military/world/india/images/cpi-m.gif",
      leader_img:
        "https://i.pinimg.com/1200x/00/b2/c8/00b2c835686c67028a5ae70d27349308.jpg",
    },
  ];

  // Check if already voted - Redirect
  useEffect(() => {
    if (hasVoted()) {
      navigate("/survey", { replace: true });
    }
  }, [hasVoted, navigate]);

  // Success - Navigate to survey
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/survey", { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  // Clear error when candidate changes
  useEffect(() => {
    if (error && selectedCandidate) {
      reset();
    }
  }, [selectedCandidate]);

  // Handle Vote
  const handleVote = async () => {
    if (!selectedCandidate || isLoading) return;
    playClick();
    await castVote(selectedCandidate.id);
  };

  return (
    <div className="h-dvh overflow-hidden md:overflow-auto relative">
      {/* Main Container - NO overflow-hidden here */}
      <div className="w-full mx-auto relative z-10">
        <div className="w-full mx-auto h-dvh relative flex flex-col justify-between py-4">
          {/* Enhanced Header */}
          <div className="flex justify-center items-start z-20 px-4">
            <div className="relative">
              <div className="text-center">
                <h1 className="text-[18px] lg:text-[24px] font-heading uppercase font-black tracking-wider leading-5.5 md:leading-11 text-transparent bg-linear-to-r from-accet via-accet/80 to-indigo-500 bg-clip-text drop-shadow-[0_0_30px_rgba(95, 98, 233,0.2)]">
                  {t("vote.title")}
                </h1>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full mx-auto flex flex-col justify-center items-center">
            <SwiperCard
              candidates={candidates}
              selectedCandidate={selectedCandidate}
              setSelectedCandidate={setSelectedCandidate}
            />
          </div>

          {/* Vote Button */}
          <div className="flex justify-center items-center flex-col relative px-4">
            <button
              onClick={handleVote}
              disabled={!selectedCandidate || isLoading || isSuccess}
              className={`relative w-[95%] md:w-80 py-3 lg:py-4 rounded uppercase font-bold tracking-widest text-[12px] lg:text-[14px] font-heading overflow-hidden transition-all duration-500 ${
                selectedCandidate && !isLoading && !isSuccess
                  ? "bg-linear-to-r from-accet via-indigo-500 to-accet/50 text-black hover:shadow-[0_0_30px_#4C43DD] hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-linear-to-r from-white/10 to-white/5 text-white/30 cursor-not-allowed border border-white/10"
              }`}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />

              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>{t("vote.submitting")}</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>வாக்கு பதிவானது!</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{t("vote.castVote")}</span>
                  </>
                )}
              </span>
            </button>

            <p
              className={`text-center text-[8px] lg:text-[10px] mt-2 transition-all duration-300 ${
                selectedCandidate ? "text-accet/60" : "text-white/40"
              }`}
            >
              {isSuccess
                ? "✓ சர்வே பக்கத்திற்கு செல்கிறது..."
                : selectedCandidate
                ? `✓ ${selectedCandidate.name} ${t("vote.selectedSuffix")}`
                : t("vote.instruction")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote;

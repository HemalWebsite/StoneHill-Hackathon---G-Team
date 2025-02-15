import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X as DeleteIcon } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import OutfitGenerator from './outfitGenerator';

function Search() {
  const [pants, setPants] = useState('');
  const [tshirts, setTshirts] = useState('');
  const [shorts, setShorts] = useState('');
  const [pantsList, setPantsList] = useState([]);
  const [tshirtsList, setTshirtsList] = useState([]);
  const [shortsList, setShortsList] = useState([]);
  const [weather, setWeather] = useState('');
  const [occasion, setOccasion] = useState('');
  const [location, setLocation] = useState(''); // New state for location
  const [sex, setSex] = useState(''); // New state for sex
  const [age, setAge] = useState(''); // New state for age
  const [showOutfit, setShowOutfit] = useState(false); // Controls when to display OutfitGenerator
  const [specialRequirement, setSpecialRequirement] = useState('');
  const [specialRequirementsList, setSpecialRequirementsList] = useState([]);
  const [pantsSuggestions, setPantsSuggestions] = useState([]);
  const [tshirtsSuggestions, setTshirtsSuggestions] = useState([]);
  const [shortsSuggestions, setShortsSuggestions] = useState([]);
  const [specialSuggestions, setSpecialSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState({
    pants: false,
    tshirts: false,
    shorts: false,
    special: false
  });

  useEffect(() => {
    const unsubscribePants = onSnapshot(collection(db, 'searches', 'pants', 'items'), (snapshot) => {
      setPantsList(snapshot.docs.map(doc => doc.data().query));
    });
    const unsubscribeTshirts = onSnapshot(collection(db, 'searches', 'tshirts', 'items'), (snapshot) => {
      setTshirtsList(snapshot.docs.map(doc => doc.data().query));
    });
    const unsubscribeShorts = onSnapshot(collection(db, 'searches', 'shorts', 'items'), (snapshot) => {
      setShortsList(snapshot.docs.map(doc => doc.data().query));
    });
    const unsubscribeSpecial = onSnapshot(collection(db, 'searches', 'special', 'items'), (snapshot) => {
      setSpecialRequirementsList(snapshot.docs.map(doc => doc.data().query));
    });

    return () => {
      unsubscribePants();
      unsubscribeTshirts();
      unsubscribeShorts();
      unsubscribeSpecial();
    };
  }, []);
  const handleSearch = async (event, type, value) => {
    if (event.key === 'Enter' && value.trim() !== '') {
      try {
        await addDoc(collection(db, 'searches', type, 'items'), {
          query: value.trim(),
          timestamp: serverTimestamp(),
        });
        console.log(`Added ${value} to ${type}`);
        if (type === 'pants') setPants('');
        if (type === 'tshirts') setTshirts('');
        if (type === 'shorts') setShorts('');
        if (type === 'special') setSpecialRequirement('');
      } catch (error) {
        console.error('Error saving search:', error);
      }
    }
  };

  const handleDelete = async (type, word) => {
    try {
      const q = query(collection(db, 'searches', type, 'items'), where('query', '==', word));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      console.log(`Deleted ${word} from ${type}`);
      if (type === 'pants') setPantsList((prev) => prev.filter(item => item !== word));
      if (type === 'tshirts') setTshirtsList((prev) => prev.filter(item => item !== word));
      if (type === 'shorts') setShortsList((prev) => prev.filter(item => item !== word));
      if (type === 'special') setSpecialRequirementsList((prev) => prev.filter(item => item !== word));
    } catch (error) {
      console.error('Error deleting search:', error);
    }
  };

  const handleInputChange = (value, type) => {
    const setValue = {
      pants: setPants,
      tshirts: setTshirts,
      shorts: setShorts,
      special: setSpecialRequirement
    }[type];

    setValue(value);

    if (value.trim() === '') {
      setShowSuggestions(prev => ({ ...prev, [type]: false }));
      return;
    }

    const list = {
      pants: pantsList,
      tshirts: tshirtsList,
      shorts: shortsList,
      special: specialRequirementsList
    }[type];

    const suggestions = list.filter(item =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    const setSuggestions = {
      pants: setPantsSuggestions,
      tshirts: setTshirtsSuggestions,
      shorts: setShortsSuggestions,
      special: setSpecialSuggestions
    }[type];

    setSuggestions(suggestions);
    setShowSuggestions(prev => ({ ...prev, [type]: true }));
  };

  const handleSuggestionClick = (value, type) => {
    const setValue = {
      pants: setPants,
      tshirts: setTshirts,
      shorts: setShorts,
      special: setSpecialRequirement
    }[type];

    setValue(value);
    setShowSuggestions(prev => ({ ...prev, [type]: false }));
  };

  const renderInput = (type, value, placeholder) => (
    <div className="w-full mb-4 p-3 bg-white rounded-lg shadow">
      {/* <div className="font-bold text-gray-700 mb-2">{placeholder}</div> */}
      <div className="card mb-4">
        <div className="card-header">
          {placeholder}
        </div>
        <div className="card-text" >
`         <input
        type="text"
        style={{ backgroundColor: "white", width:"85%", margin:"10px", borderRadius:"25px" }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleInputChange(e.target.value, type)}
        onKeyDown={(e) => handleSearch(e, type, value)}
        onBlur={() =>
          setTimeout(
            () => setShowSuggestions((prev) => ({ ...prev, [type]: false })),
            200
          )
        }
        className="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 transition-all"
      />
        </div>
      </div>
      {/* <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleInputChange(e.target.value, type)}
        onKeyDown={(e) => handleSearch(e, type, value)}
        onBlur={() =>
          setTimeout(
            () => setShowSuggestions((prev) => ({ ...prev, [type]: false })),
            200
          )
        }
        className="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 transition-all"
      /> */}
      {showSuggestions[type] && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {({
            pants: pantsSuggestions,
            tshirts: tshirtsSuggestions,
            shorts: shortsSuggestions,
            special: specialSuggestions,
          }[type]).map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
              onClick={() => handleSuggestionClick(suggestion, type)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
  

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4 flex-col">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">Your Wardrobe</h1>

        {/* Select Weather */}
        <select value={weather} onChange={(e) => setWeather(e.target.value)} className="p-2 rounded-lg bg-white text-black mb-4">
          <option value="">Select Weather</option>
          <option value="hot">Hot</option>
          <option value="cold">Cold</option>
          <option value="rainy">Rainy</option>
        </select>

        {/* Select Location */}
        <select value={location} onChange={(e) => setLocation(e.target.value)} className="p-2 rounded-lg bg-white text-black mb-4">
          <option value="">Select Location</option>
          <option value="beach">Beach</option>
          <option value="office">Office</option>
          <option value="gym">Gym</option>
          <option value="restaurant">Restaurant</option>
          <option value="park">Park</option>
        </select>

        {/* Select Sex */}
        <select value={sex} onChange={(e) => setSex(e.target.value)} className="p-2 rounded-lg bg-white text-black mb-4">
          <option value="">Select Sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* Select Age */}
        <select value={age} onChange={(e) => setAge(e.target.value)} className="p-2 rounded-lg bg-white text-black mb-4">
          <option value="">Select Age Group</option>
          <option value="child">Child</option>
          <option value="young">Young</option>
          <option value="adult">Adult</option>
          <option value="middleAge">Middle Age</option>
          <option value="senior">Senior</option>
        </select>

        {/* Select Occasion */}
        <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="p-2 rounded-lg bg-white text-black mb-4">
          <option value="">Select Occasion</option>
          <option value="casual">Casual</option>
          <option value="party">Party</option>
          <option value="date">Date</option>
          <option value="formal">Formal</option>
          <option value="religous-festival">Religious Festival</option>
        </select>

        {/* Input for Special Requirements */}
        {renderInput('special', specialRequirement, 'Add Special Requirements (e.g., all blue clothes, traditional wear)...')}
        {specialRequirementsList.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-white/10 px-4 py-2 rounded-lg mb-2">
            {/* <span className="text-white">{item}</span>
            <button onClick={() => handleDelete('special', item)} className="p-2 bg-red-500 rounded-full hover:bg-red-700 transition-all">
              <DeleteIcon className="h-5 w-5 text-white" />
            </button> */}
            <div className="card mb-3">
              <div class="row g-0">
                  <div class="col-md-4">
                  <img src="https://picsum.photos/200" class="img-fluid rounded-start" alt="..."></img>
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">{item}</h5>
                      <p class="card-text"><small class="text-body-secondary">
                                <button onClick={() => handleDelete('pants', item)} className="p-2 btn btn-danger rounded-full hover:bg-red-700 transition-all">
                        Delete <DeleteIcon className="h-5 w-5 text-white" />
                      </button>
                        </small></p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        ))}

        {/* Input for Pants */}
        {renderInput('pants', pants, 'Add Pants...')}
        {pantsList.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-white/10 px-4 py-2 rounded-lg mb-2">

            <div className="card mb-3">
              <div class="row g-0">
                  <div class="col-md-4">
                  <img src="https://picsum.photos/200" class="img-fluid rounded-start" alt="..."></img>
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">{item}</h5>
                      <p class="card-text"><small class="text-body-secondary">
                                <button onClick={() => handleDelete('pants', item)} className="p-2 btn btn-danger rounded-full hover:bg-red-700 transition-all">
                        <DeleteIcon className="h-5 w-5 text-white" />
                      </button>
                        </small></p>
                    </div>
                  </div>
              </div>
            </div>

            {/* <span className="text-black">{item}</span> */}
            {/* <button onClick={() => handleDelete('pants', item)} className="p-2 bg-red-500 rounded-full hover:bg-red-700 transition-all">
              <DeleteIcon className="h-5 w-5 text-white" />
            </button> */}
          </div>
        ))}

        {/* Input for T-Shirts */}
        {renderInput('tshirts', tshirts, 'Add T-Shirts...')}
        {tshirtsList.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-white/10 px-4 py-2 rounded-lg mb-2">
            {/* <span className="text-white">{item}</span>
            <button onClick={() => handleDelete('tshirts', item)} className="p-2 bg-red-500 rounded-full hover:bg-red-700 transition-all">
              <DeleteIcon className="h-5 w-5 text-white" />
            </button> */}
            <div className="card mb-3">
              <div class="row g-0">
                  <div class="col-md-4">
                    <img src="https://picsum.photos/200" class="img-fluid rounded-start" alt="..."></img>
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">{item}</h5>
                      <p class="card-text"><small class="text-body-secondary">
                                <button onClick={() => handleDelete('pants', item)} className="p-2 btn btn-danger rounded-full hover:bg-red-700 transition-all">
                        <DeleteIcon className="h-5 w-5 text-white" />
                      </button>
                        </small></p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        ))}

        {/* Input for Shorts */}
        {renderInput('shorts', shorts, 'Add Shorts...')}
        {shortsList.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-white/10 px-4 py-2 rounded-lg mb-2">
            {/* <span className="text-white">{item}</span>
            <button onClick={() => handleDelete('shorts', item)} className="p-2 bg-red-500 rounded-full hover:bg-red-700 transition-all">
              <DeleteIcon className="h-5 w-5 text-white" />
            </button> */}
            <div className="card mb-3">
              <div class="row g-0">
                  <div class="col-md-4">
                  <img src="https://picsum.photos/200" class="img-fluid rounded-start" alt="..."></img>
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">{item}</h5>
                      <p class="card-text"><small class="text-body-secondary">
                                <button onClick={() => handleDelete('pants', item)} className="p-2 btn btn-danger rounded-full hover:bg-red-700 transition-all">
                        <DeleteIcon className="h-5 w-5 text-white" />
                      </button>
                        </small></p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        ))}

        {/* Generate Outfit Button */}
        <button
          onClick={() => setShowOutfit(true)}
          className="mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-all btn btn-primary"
        >
          Generate Outfit
        </button>

        {/* Display OutfitGenerator when button is clicked */}
        {showOutfit && <OutfitGenerator pantsList={pantsList} tshirtsList={tshirtsList} shortsList={shortsList} weather={weather} occasion={occasion} location={location} sex={sex} age={age} specialRequirements={specialRequirementsList} />}
      </div>
    </div>
  );
}

export default Search;

// import React, { useState, useEffect } from 'react';
// import { Search as SearchIcon, X as DeleteIcon, Upload as UploadIcon } from 'lucide-react';
// import { db, storage } from '../firebase';
// import { collection, addDoc, deleteDoc, doc, serverTimestamp, onSnapshot, query, where, getDocs } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import OutfitGenerator from './outfitGenerator';

// function Search() {
//   const [pants, setPants] = useState('');
//   const [tshirts, setTshirts] = useState('');
//   const [shorts, setShorts] = useState('');
//   const [pantsList, setPantsList] = useState([]);
//   const [tshirtsList, setTshirtsList] = useState([]);
//   const [shortsList, setShortsList] = useState([]);
//   const [pantsImages, setPantsImages] = useState({});
//   const [tshirtsImages, setTshirtsImages] = useState({});
//   const [shortsImages, setShortsImages] = useState({});
//   const [weather, setWeather] = useState('');
//   const [occasion, setOccasion] = useState('');
//   const [location, setLocation] = useState('');
//   const [sex, setSex] = useState('');
//   const [age, setAge] = useState('');
//   const [showOutfit, setShowOutfit] = useState(false);

//   useEffect(() => {
//     const fetchData = async (type, setList, setImages) => {
//       const unsubscribe = onSnapshot(collection(db, 'searches', type, 'items'), async (snapshot) => {
//         const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setList(items);
//         const imagePromises = items.map(async (item) => {
//           if (item.imageUrl) return { [item.id]: item.imageUrl };
//           return { [item.id]: null };
//         });
//         const images = Object.assign({}, ...(await Promise.all(imagePromises)));
//         setImages(images);
//       });
//       return unsubscribe;
//     };

//     const unsubPants = fetchData('pants', setPantsList, setPantsImages);
//     const unsubTshirts = fetchData('tshirts', setTshirtsList, setTshirtsImages);
//     const unsubShorts = fetchData('shorts', setShortsList, setShortsImages);

//     return () => {
//       unsubPants();
//       unsubTshirts();
//       unsubShorts();
//     };
//   }, []);

//   const handleSearch = async (event, type, value, imageFile) => {
//     if (event.key === 'Enter' && value.trim() !== '') {
//       try {
//         let imageUrl = null;
//         if (imageFile) {
//           const storageRef = ref(storage, `clothing/${type}/${imageFile.name}`);
//           await uploadBytes(storageRef, imageFile);
//           imageUrl = await getDownloadURL(storageRef);
//         }

//         const docRef = await addDoc(collection(db, 'searches', type, 'items'), {
//           query: value.trim(),
//           imageUrl,
//           timestamp: serverTimestamp(),
//         });

//         console.log(`Added ${value} to ${type}`);
//         if (type === 'pants') setPants('');
//         if (type === 'tshirts') setTshirts('');
//         if (type === 'shorts') setShorts('');
//       } catch (error) {
//         console.error('Error saving search:', error);
//       }
//     }
//   };

//   const handleDelete = async (type, id) => {
//     try {
//       await deleteDoc(doc(db, 'searches', type, 'items', id));
//       console.log(`Deleted item from ${type}`);
//     } catch (error) {
//       console.error('Error deleting item:', error);
//     }
//   };

//   const renderInput = (type, value, placeholder, setValue) => (
//     <div className="d-flex align-items-center mb-3">
//       <input
//         type="text"
//         className="form-control me-2"
//         placeholder={placeholder}
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         onKeyDown={(e) => handleSearch(e, type, value)}
//       />
//       <label className="btn btn-secondary">
//         <UploadIcon className="me-2" />
//         <input
//           type="file"
//           className="d-none"
//           accept="image/*"
//           onChange={(e) => handleSearch(e, type, value, e.target.files[0])}
//         />
//       </label>
//     </div>
//   );

//   const renderList = (type, list, images, setList) => (
//     list.map((item, index) => (
//       <div className="card mb-3" style={{ maxWidth: "540px" }} key={index}>
//         <div className="row g-0">
//           <div className="col-md-4">
//             {images[item.id] ? (
//               <img src={images[item.id]} className="img-fluid rounded-start" alt={item.query} />
//             ) : (
//               <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "100%" }}>
//                 No Image
//               </div>
//             )}
//           </div>
//           <div className="col-md-8">
//             <div className="card-body">
//               <h5 className="card-title">{item.query}</h5>
//               <p className="card-text">
//                 This is a saved clothing item.
//               </p>
//               <p className="card-text">
//                 <small className="text-body-secondary">
//                   Last updated just now
//                 </small>
//               </p>
//               <button onClick={() => handleDelete(type, item.id)} className="btn btn-danger">
//                 <DeleteIcon className="me-2" /> Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     ))
//   );

//   return (
//     <div className="container py-5">
//       <h1 className="text-center mb-4">Your Wardrobe</h1>

//       {/* Inputs */}
//       {renderInput('pants', pants, 'Add Pants...', setPants)}
//       {renderList('pants', pantsList, pantsImages, setPantsList)}

//       {renderInput('tshirts', tshirts, 'Add T-Shirts...', setTshirts)}
//       {renderList('tshirts', tshirtsList, tshirtsImages, setTshirtsList)}

//       {renderInput('shorts', shorts, 'Add Shorts...', setShorts)}
//       {renderList('shorts', shortsList, shortsImages, setShortsList)}

//       {/* Generate Outfit Button */}
//       <div className="text-center">
//         <button
//           onClick={() => setShowOutfit(true)}
//           className="btn btn-primary mt-4"
//         >
//           Generate Outfit
//         </button>
//       </div>

//       {/* Display OutfitGenerator */}
//       {showOutfit && <OutfitGenerator pantsList={pantsList} tshirtsList={tshirtsList} shortsList={shortsList} weather={weather} occasion={occasion} location={location} sex={sex} age={age} />}
//     </div>
//   );
// }

// export default Search;

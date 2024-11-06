import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Autocomplete.css";
import { useEffect, useRef, useState } from "react";
import words from "../data/words";

function Autocomplete({ type, placeholder, template }) {
    const [query, setQuery] = useState("");
    const [matches, setMatches] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [searchMode, setSearchMode] = useState("");
    const [productMatches, setProductMatches] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const dropdownRef = useRef(null);

    // Gère la fermeture de la liste déroulante lorsqu'on clique en dehors
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMatches([]);
                setProductMatches([]);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // 1. Autocomplete user simple avec data en props
    const handleLocalSearch = (value) => {
        setQuery(value);
        setSearchMode("local");
        if (value.length > 0) {
            setMatches(
                words
                    .filter((word) => word.startsWith(value))
                    .slice(0, 12)
                    .sort()
            );
        } else {
            setMatches([]);
        }
    };

    // 2. Autocomplete User simple avec data en fonction
    const fetchMatchesFromAPIUser = async (searchTerm) => {
        setQuery(searchTerm);
        setSearchMode("api");
        try {
            const response = await fetch("http://localhost:3000/user/1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ terms: [searchTerm] }),
            });
            const data = await response.json();
            setMatches(data.data.slice(0, 20));
            return data.data
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
        }
    };

    // 3. Autocomplete User multiple avec data en fonction
    const handleMultipleSearch = (value) => {
        setQuery(value);
        setSearchMode("multiple");
        if (value.length > 0) {
            setMatches(
                words
                    .filter((word) => word.startsWith(value))
                    .slice(0, 12)
                    .sort()
            );
        } else {
            setMatches([]);
        }
    };

    const handleSelectMultipleWords = (word) => {
        setSelectedWords((prevSelectedWords) => {
            if (prevSelectedWords.includes(word)) {
                return prevSelectedWords.filter((selected) => selected !== word);
            } else {
                return [...prevSelectedWords, word];
            }
        });
        setQuery("");
        setMatches([]);
    };

    // 4. Autocomplete Product simple avec data en fonction
    const fetchMatchesFromAPIProduct = async (searchTerm) => {
        setQuery(searchTerm);
        setSearchMode("product");
        try {
            const response = await fetch("http://localhost:3000/product/1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ terms: [searchTerm] }),
            });
            const data = await response.json();
            setProductMatches(data.data.slice(0, 20));
        } catch (error) {
            console.error("Erreur lors de la récupération des produits :", error);
        }
    };

    // 5. Autocomplete Product multiple avec data en fonction
    const handleSelectMultipleProducts = (product) => {
        setSelectedProducts((prevSelectedProducts) => {
            if (prevSelectedProducts.includes(product)) {
                return prevSelectedProducts.filter((selected) => selected !== product);
            } else {
                return [...prevSelectedProducts, product];
            }
        });
        setQuery("");
        setProductMatches([]);
    };

    // 6. Autocomplete Mix multiple avec data en fonction
    const fetchMixedMatches = async (searchTerm) => {
        setQuery(searchTerm);
        setSearchMode("mix");
        try {
            const userMatches = await fetchMatchesFromAPIUser(searchTerm);
            const productMatches = await fetchMatchesFromAPIProduct(searchTerm);
            const combinedResults = [
                ...(userMatches || []).slice(0, 10),
                ...(productMatches || []).slice(0, 10),
            ];

            setMatches(combinedResults);
        } catch (error) {
            console.error("Erreur lors de la récupération des données mixtes :", error);
        }
    };

    // Gère le changement de valeur de l'entrée en fonction du type de recherche
    const handleInputChange = (event) => {
        const value = event.currentTarget.value;
        if (type === "local") {
            handleLocalSearch(value);
        } else if (type === "api") {
            fetchMatchesFromAPIUser(value);
        } else if (type === "multiple") {
            handleMultipleSearch(value);
        } else if (type === "product") {
            fetchMatchesFromAPIProduct(value);
        } else if (type === "mix") {
            fetchMixedMatches(value);
        } 
    };

    return (
        <div className="autocomplete" ref={dropdownRef}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
            />
            <FontAwesomeIcon icon={faSearch} className="icon" />

            {/* 1. Autocomplete user simple avec data en props */}
            {searchMode === "local" && matches.length > 0 && (
                <ul className="dropdown">
                    {matches.map((word, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                setQuery(word);
                                setMatches([]);
                            }}
                            className="dropdown-item"
                        >
                            {word}
                        </li>
                    ))}
                </ul>
            )}

            {/* 2. Autocomplete User simple avec data en fonction */}
            {searchMode === "api" && matches.length > 0 && (
                <ul className="dropdown">
                    {matches.map((user, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                setQuery(`${user.firstName} ${user.lastName}`);
                                setMatches([]);
                            }}
                            className="dropdown-item"
                        >
                            {user.firstName} {user.lastName} - {user.jobTitle}
                        </li>
                    ))}
                </ul>
            )}

            {/* 3. Autocomplete User multiple avec data en fonction */}
            {searchMode === "multiple" && matches.length > 0 && (
                <ul className="dropdown">
                    {matches.map((word, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectMultipleWords(word)}
                            className={`dropdown-item ${selectedWords.includes(word) ? "multi-select-selected-item" : ""}`}
                        >
                            {word}
                        </li>
                    ))}
                </ul>
            )}

            {/* Affichage des mots sélectionnés pour la recherche multiple */}
            {selectedWords.length > 0 && (
                <div className="multi-select-selected">
                    {selectedWords.map((word, index) => (
                        <span key={index} className="multi-select-tag">
                            {word}
                            <button onClick={() => handleSelectMultipleWords(word)} className="multi-select-remove">
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* 4. Autocomplete Product simple avec data en fonction */}
            {searchMode === "product" && productMatches.length > 0 && (
                <ul className="dropdown">
                    {productMatches.map((product, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                setQuery(product.name);
                                setProductMatches([]);
                            }}
                            className="dropdown-item"
                        >
                            {product.name} - ${product.price}
                        </li>
                    ))}
                </ul>
            )}

            {/* 5. Autocomplete Product multiple avec data en fonction */}
            {searchMode === "product-multiple" && productMatches.length > 0 && (
                <ul className="dropdown">
                    {productMatches.map((product, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectMultipleProducts(product)}
                            className={`dropdown-item ${selectedProducts.includes(product) ? "multi-select-selected-item" : ""
                                }`}
                        >
                            {product.name} - ${product.price}
                        </li>
                    ))}
                </ul>
            )}

            {selectedProducts.length > 0 && (
                <div className="multi-select-selected">
                    {selectedProducts.map((product, index) => (
                        <span key={index} className="multi-select-tag">
                            {product.name}
                            <button onClick={() => handleSelectMultipleProducts(product)} className="multi-select-remove">
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* 6. Autocomplete Mix multiple avec data en fonction  */}
            {searchMode === "mix" && matches.length > 0 && (
                <ul className="dropdown">
                    {matches.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                if (item.firstName) {
                                    setQuery(`${item.firstName} ${item.lastName}`);
                                } else if (item.name) {
                                    setQuery(item.name);
                                }
                                setMatches([]);
                            }}
                            className="dropdown-item"
                        >
                            {item.firstName
                                ? `${item.firstName} ${item.lastName} - ${item.jobTitle}`
                                : `${item.name} - $${item.price}`}
                        </li>
                    ))}
                </ul>
            )}

            {/* 7. Autocomplete Product simple avec template */}
            {searchMode === "product" && productMatches.length > 0 && (
                <ul className="dropdown">
                    {productMatches.map((product, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                setQuery(product.name);
                                setProductMatches([]);
                            }}
                            className="dropdown-item"
                        >
                            {template ? template(product) : `${product.name} - $${product.price}`}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Autocomplete;

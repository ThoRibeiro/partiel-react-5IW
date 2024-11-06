import Autocomplete from './Components/Autocomplete';
import ProductTemplate from './data/Template';


function App() {
    const productTemplate = (product) => <ProductTemplate product={product} />;


    return (
        <div className="App">
            {/* 1. Autocomplétion mot simple avec data en props */}
            <div><h2 className="title">1. Autocomplétion mot simple avec data en props</h2></div>
            <Autocomplete
                type="local"
                placeholder="Rechercher en local..."
            />

            {/* 2. Autocomplete User simple avec data en fonction */}
            <div><h2 className="title">2. Autocomplete User simple avec data en fonction</h2></div>
            <Autocomplete
                type="api"
                placeholder="Rechercher via API..."
                fetchFunction="user"
            />

            {/* 3. Autocomplétion avec sélection multiple */}
            <div><h2 className="title">3. Autocomplétion avec sélection multiple</h2></div>
            <Autocomplete
                type="multiple"
                placeholder="Rechercher plusieurs mots..."
            />

            {/* 4. Autocomplete Product simple avec data en fonction */}
            <div><h2 className="title">4. Autocomplete Product simple avec data en fonction</h2></div>
            <Autocomplete
                type="product"
                placeholder="Rechercher un produit..."
                fetchFunction="product"
            />

            {/* 5. Autocomplétion produit multiple via API */}
            <div><h2 className="title">5. Autocomplete Product multiple avec data en fonction</h2></div>
            <Autocomplete
                type="product-multiple"
                placeholder="Rechercher plusieurs produits..."
            />

            {/* 6. Autocomplete Mix multiple avec data en fonction */}
            <div><h2 className="title">6. Autocomplete Mix multiple avec data en fonction</h2></div>
            <Autocomplete
                type="mix"
                placeholder="Rechercher utilisateurs et produits..."
            />

            {/* 7. Autocomplete Product simple avec template */}
            <div><h2 className="title">7. Autocomplete Product simple avec template</h2></div>
            <Autocomplete
                type="product"
                placeholder="Rechercher un produit..."
                template={productTemplate}
            />
        </div>
    );
}

export default App;

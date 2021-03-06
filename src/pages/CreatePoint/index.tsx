import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import InputMask from 'react-input-mask';
import axios from 'axios';

import './styles.css';
import api from '../../services/api';
import Dropzone from '../../components/Dropzone';

interface Item {
    id: number;
    title: string;
    image_url: string;
};

interface IBGEUfRes {
    sigla: string;
};

interface IBGECityRes {
    nome: string;
};

const CreatePoint = () => {
    // States iniciais do formulário
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [items, setItems] = useState<Item[]>([]);

    // States após o preenchimento do formulário
    const [selectedFile, setSelectedFile] = useState<File>();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const history = useHistory();

    useEffect(() => {
        async function loadPosition() {
            const res = await axios.get('https://ipinfo.io/geo');
            const { loc } = res.data;
            const latlng = loc.split(',').map((item: string) => parseFloat(item))

            setInitialPosition(latlng);
        }
        loadPosition()
    }, []);

    useEffect(() => {
        axios.get<IBGEUfRes[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(res => {
            const ufInitials = res.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        })
    }, []);

    useEffect(() => {
        if (selectedUf === '0') return;
        axios.get<IBGECityRes[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos?orderBy=nome`).then(res => {
            const cityNames = res.data.map(city => city.nome);
            setCities(cityNames);
        })
    }, [selectedUf]);

    useEffect(() => {
        api.get('/items').then(res => {
            setItems(res.data)
        })
    }, []);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target

        setFormData({ ...formData, [name]: value })    
    };

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    };

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    };

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    };

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([ ...selectedItems, id ]);
        }
    };

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const [latitude, longitude] = selectedPosition;
        const uf = selectedUf;
        const city = selectedCity;
        const items = selectedItems;

        console.log('email', email)
        console.log('whatsapp', whatsapp)

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('uf', uf);
        data.append('city', city);
        data.append('items', items.join(','));
        if (selectedFile) data.append('image', selectedFile);
        
        api.post('/points', data);

        alert('Cadastro criado!');

        history.push('/dashboard'); 
    };

    return (
        <>
            <div id="page-create-point">
                <header>
                   

                    <Link to="/">
                        <span>
                            <FiArrowLeft />
                        </span>
                        <strong>Voltar</strong>
                    </Link>
                </header>

                <form onSubmit={handleSubmit}>
                    <h1>Cadastro da Startup</h1>

                    <Dropzone onFileUploaded={setSelectedFile} />

                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                        </legend>
                        <div className="field">
                            <label htmlFor="nome">Nome da startup</label>
                            <input 
                                id="name" 
                                name="name"
                                type="text"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="email">E-mail</label>
                                <input 
                                    id="email" 
                                    name="email"
                                    type="email"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="whatsapp">Whatsapp</label>
                                <InputMask 
                                    id="whatsapp"
                                    name="whatsapp"
                                    type="text"
                                    mask="+5\599999999999" 
                                    maskChar={null}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>Endereço</h2>
                            <span>Selecione o endereço no mapa</span>
                        </legend>

                        <Map center={initialPosition} zoom={15} onclick={handleMapClick}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker position={selectedPosition} />
                        </Map>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado</label>
                                <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                    <option value="0">Selecione um UF</option>
                                    {ufs.map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                    <option value="0">Selecione uma cidade</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>Categoria / Área de atuação</h2>
                            <span>Selecione um ou mais ítens abaixo</span>
                        </legend>
                        <ul className="items-grid">
                            {items.map(item => (
                                <li 
                                    key={item.id} 
                                    onClick={() => handleSelectItem(item.id)}
                                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                                >
                                    <img src={item.image_url} alt=""/>
                                    <span>{item.title}</span>
                                </li>
                            ))}
                        </ul>
                    </fieldset>

                    <button type="submit">
                        <span>
                            <FiSave />
                        </span>
                        <strong>Cadastrar startup</strong>
                    </button>
                </form>
            </div>
        </>
    )
};

export default CreatePoint;

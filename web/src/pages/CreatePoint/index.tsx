import React, {useEffect, useState, ChangeEvent} from 'react';
import {Link} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import { Map, TileLayer, Marker} from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import {LeafletMouseEvent} from 'leaflet';

import './styles.css';
import Axios from 'axios';
//import logo '../../assets/logo.svg'; TO DO

interface Item {
    id:number;
    title:string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () =>{
const [items, setItems] = useState<Item[]>([]);
const [ufs, setUfs] = useState<string[]>([]);
const [cities, setCities] = useState<string[]>([]);
const[initialPosition, setinitialPosition] = useState<[number, number]>([0,0]);

/**
 * const{formData, setFormData} = useState({
    name:'',
    email:'',
    whatsapp:'',
});
 */

const[selectedUf, setSelectedUf] = useState('Abc');
const[selectedCity, setSelectedCity] = useState('Abc');
const[selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);


useEffect(() => { 
    navigator.geolocation.getCurrentPosition(
        position => {
            const{latitude, longitude} = position.coords;
            setinitialPosition([latitude, longitude]);
    });
}, []);

    useEffect(() => {  //TO DO
        api.get('items').then(response => {
         setItems(response.data);
        //console.log(response);
        });
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then( response => {
            //console.log(response)
            const ufInitials = response.data.map(uf =>uf.sigla);
            setUfs(ufInitials);
        });
        
    }, []);

    useEffect(() => {
        console.log('mudou', selectedUf);
    
    
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then( response => {
            //console.log(response)
            const cityNames = response.data.map(city =>city.nome);
            setCities(cityNames);
        });
    
    }, [selectedUf]);


    function handleSelectUf( event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    function handleSelectCity( event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;

        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

/**
 *  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target;
        setFormData( {...formData, [name]: value})
    
    }
TO DO
 */
   
    return(
        <div id="page-create-point">
            <header>
                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para Home
                </Link>
            </header>
            <form>
                <h1>Cadastro do<br/> Ponto de Coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"

                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">e-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"/>
                            
                            
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"/>
                            
                            
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o ponto no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={selectedPosition}/>
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="Abc">Selecione um Estado</option>
                                {ufs.map(uf =>(
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="Abc">Selecione um cidade</option>
                                {cities.map(city =>(
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione os itens de coleta abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item =>(
                        <li key={item.id}>
                            <img src={item.image_url} alt="oleo de cozinha imagem"/>
                            <span>{item.title}</span>
                        </li>) )}
                        
                    </ul>
                </fieldset>
                <button className="submite">
                    Cadastrar ponto de coleta
                </button>
            </form>

        </div>
    )
}

export default CreatePoint;
import { useState, useEffect } from 'react';
import { Accordion} from 'react-bootstrap';
import fetchData from '../services/modalidadesBecaAPI';
import '../styles/FrequentlyAskedQuestions.css';
import '../styles/TipoBecas.css';    

const TipoBecas = () => {
    const [data, setData] = useState([]);

    const getData = async () => {
        try {
            const result = await fetchData();
            const becas = result.becarios;
            if (Array.isArray(becas)) {
                setData(becas);
            } else {
                console.error("Error: La API no devolvió becas en el formato esperado.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className='becas-section'>
            <h1>Modalidades de Becas que se te ofrecen:</h1>
            {data.length > 0 ? (
                <Accordion defaultActiveKey="0">
                    {data.map((item, index) => (
                            <Accordion.Item eventKey={index.toString()} key={index}>
                                <Accordion.Header>{item.nombre_beca}</Accordion.Header>
                                <Accordion.Body>{item.descripcion}</Accordion.Body>
                            </Accordion.Item>
                        ))}
                </Accordion>
            ) : (
                <p className="no-results">No se encontraron resultados</p>
            )}
        </div>
    );
};

export default TipoBecas;

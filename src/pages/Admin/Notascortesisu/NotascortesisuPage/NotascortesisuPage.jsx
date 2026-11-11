import React, { useState, useEffect } from 'react';
import notascortesisuApi from '../../../../services/apiServices/notascortesisuApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { normalizeNotaCorteSisu, notasCorteSisuFields } from '../notasCorteSisuFields';

const NotascortesisuPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [item, setItem] = useState({});

    useEffect(() => {
        const fetchItem = async () => {
            dispatch(setLoading(true));
            try {
                const response = await notascortesisuApi.getById(id);
                setItem(normalizeNotaCorteSisu(response.object));
            } catch {
                toast.error('Erro ao buscar.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItem();
    }, [id, dispatch]);

    return (
        <div className="container-fluid py-4">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <h1 className="h4 mb-0">Detalhes da Nota de corte</h1>
                    <button type="button" className="btn btn-outline-primary" onClick={() => navigate('editar')}>
                        <i className="bi bi-pencil me-2" aria-hidden="true"></i>
                        Editar
                    </button>
                </div>
                <div className="card-body">
                    <dl className="row mb-0">
                        <dt className="col-sm-3 text-body-secondary">Id</dt>
                        <dd className="col-sm-9">{item.id ?? '-'}</dd>
                        {notasCorteSisuFields.map((field) => (
                            <React.Fragment key={field.name}>
                                <dt className="col-sm-3 text-body-secondary">{field.label}</dt>
                                <dd className="col-sm-9">{item[field.name] ?? '-'}</dd>
                            </React.Fragment>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default NotascortesisuPage;

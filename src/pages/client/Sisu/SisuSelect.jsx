import React, { useMemo, useState } from 'react';

const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const SisuSelect = ({ id, label, resource, value, onChange, placeholder, disabled = false }) => {
    const [search, setSearch] = useState('');
    const options = useMemo(() => {
        const unique = new Map();
        for (const item of resource.data) {
            if (item.codigo !== null && item.codigo !== undefined && item.nome) {
                unique.set(String(item.codigo), { value: String(item.codigo), label: item.nome });
            }
        }
        return [...unique.values()].sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
    }, [resource.data]);
    const visible = options.filter((option) => option.value === value || normalize(option.label).includes(normalize(search)));
    const unavailable = disabled || resource.status !== 'ready' || options.length === 0;

    return (
        <div>
            <label htmlFor={id} className="form-label">{label}</label>
            {options.length > 10 && (
                <input type="search" className="form-control mb-2" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Digite parte do nome para filtrar" aria-label={`Buscar opções de ${label.toLowerCase()}`} disabled={disabled} />
            )}
            <select id={id} className="form-select" value={value} onChange={(event) => onChange(event.target.value)} disabled={unavailable} required aria-busy={resource.status === 'loading'}>
                <option value="">{resource.status === 'loading' ? 'Carregando opções...' : placeholder}</option>
                {visible.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {resource.status === 'error' && <p className="small text-danger mt-2 mb-0" role="alert">Não foi possível carregar as opções. <button type="button" className="btn btn-link btn-sm p-0" onClick={resource.retry}>Tentar novamente</button></p>}
            {resource.status === 'ready' && options.length === 0 && <p className="small text-body-secondary mt-2 mb-0">Nenhuma opção disponível na base consultada.</p>}
        </div>
    );
};

export default SisuSelect;

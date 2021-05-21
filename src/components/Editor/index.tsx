import React from 'react';
import { Button, Card, InputText, Dropdown, InputMask, Calendar } from '../prime';

import { Styled, StyledType } from './Editor.types';
import useForm from '../hooks/useForm';
import Controller from '../Controller';
import { joiResolver } from '@hookform/resolvers/joi';

function element(field, {type = 'string', ...props} = {}) {
    const Element: React.ElementType = {
        dropdown: Dropdown,
        mask: InputMask,
        date: Calendar
    }[type] || InputText;
    return <Element {...field} {...props}/>;
}

const Editor: StyledType = ({ classes, className, fields, cards, schema, onSubmit, ...rest }) => {
    const {handleSubmit, control, formState: {errors}} = useForm({resolver: joiResolver(schema)});
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };
    return (
        <div {...rest}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                <Button type="submit" label="Submit" className="p-mt-2" />
                {(cards || []).map(({id, title}) =>
                    <Card title={title} key={id} className="p-m-2">
                        {fields.filter(({card}) => id === card).map(({name, title, editor}) =>
                            <div className="p-field p-grid" key={name}>
                                <label className="p-col-12 p-md-2">
                                    {title}
                                </label>
                                <div className="p-col-12 p-md-10">
                                    <Controller
                                        control={control}
                                        name={name}
                                        render={({field}) => element(field, editor)}
                                    />
                                </div>
                                {getFormErrorMessage(name)}
                            </div>
                        )}
                    </Card>
                )}
            </form>
        </div>
    );
};

export default Styled(Editor);

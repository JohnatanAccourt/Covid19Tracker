import React from 'react';
import '../styles/InfoBox.css';
import {
    Card, CardContent, Typography
} from '@material-ui/core';

export default function InfoBox({title, active, isRed, cases, total, ...props}){
    return (
        <Card className={`infoBox ${active && 'infobox--selected'} ${isRed && 'infobox--red'}`} onClick={props.onClick}>
            <CardContent>
                <Typography className='infoBox__title' color="textSecondary">
                    {title}
                </Typography>

                <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>{cases}</h2>

                <Typography className='infoBox__total'>
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}
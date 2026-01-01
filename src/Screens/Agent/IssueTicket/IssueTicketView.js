import React from 'react';
import { Button, Card, Divider, Step, StepLabel, Stepper } from '@mui/material';
import Grid from '@mui/material/Grid';
import Organizations from './Organizations/Organizations';
import Cities from './Cities/Cities';
import Zones from './Zones/Zones';
import Tickets from './Tickets/Tickets';
import Plates from './Plates/Plates';
import Summary from './Summary/Summary';
import Image from './Image/Image';
import { ArrowBack, LocalPrintshopOutlined } from '@mui/icons-material';
import PublicNotes from './PublicNotes/PublicNotes';
import PrivateNotes from './PrivateNotes/PrivateNotes';

export default function IssueTicketView(props) {
    const steps = [props.literals.organization, props.literals.city, props.literals.zone, props.literals.plate, props.literals.tickets, props.literals.public_note, props.literals.private_note, props.literals.images, props.literals.summary];

    return (
        <Grid
            container
            spacing={0}
            style={{ minHeight: 'calc(100vh - 63.98px)', background: '#eee', justifyContent: 'center' }}
        >
            <Grid item md={7} sm={11} xs={12} sx={{ height: 'calc(100vh - 63.98px)' }}>
                <Card component="form" onSubmit={props.onSubmit} sx={{ pt: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Grid container sx={{ placeContent: "center", flex: '0 0 auto', overflow: 'auto' }}>
                        <Grid item md={8} sm={4} xs={4} sx={{overflow: 'auto'}}>
                            <Stepper activeStep={props.activeStep}>
                                {steps.map((label) => {
                                const stepProps = {};
                                const labelProps = {};
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                                })}
                            </Stepper>
                        </Grid>
                        <Grid item md={4} sm={8} xs={8} textAlign={'end'} sx={{px: 1}}>
                            {props.activeStep !== 0 && <Button
                                sx={{marginRight: 1, minWidth: '50px'}}
                                onClick={()=>props.handleBack()}
                                type="button"
                                variant="outlined"
                                color="primary"
                            >
                                <ArrowBack/>
                            </Button>}
                            {props.activeStep != 8 && <Button
                                onClick={()=>props.handleNext()}
                                type="button"
                                variant="contained"
                                color="primary"
                                disabled={
                                    (props.activeStep == 0 && !props.inputField.org) ||
                                    (props.activeStep == 1 && !props.inputField.city) ||
                                    (props.activeStep == 2 && !props.inputField.zone) ||
                                    (props.activeStep == 3 && !props.inputField.plate) ||
                                    (props.activeStep == 4 && !props.inputField.ticket)
                                }
                            >
                                {props.literals.next}
                            </Button>}
                            {props.activeStep === 8 && !props.isTicketIssued && <Button
                                onClick={()=>props.onTicketIssued()}
                                type="button"
                                variant="contained"
                                color="primary"
                            >
                                {props.literals.issue_ticket}
                            </Button>}
                            {props.activeStep === 8 && props.inputField.ticket_format && props.isTicketIssued && props.printer && <Button
                                onClick={()=>props.printTicket()}
                                type="button"
                                variant="contained"
                                color="primary"
                            >
                                {props.literals.print}
                            </Button>}
                            {props.activeStep === 8 && props.inputField.ticket_format && props.isTicketIssued && !props.printer && <Button
                                onClick={()=>props.configurePrinter()}
                                type="button"
                                variant="contained"
                                color="primary"
                            >
                                <LocalPrintshopOutlined/> {props.literals.configure}
                            </Button>}
                        </Grid>
                        <Grid item xs={12} sx={{mt:2}}>
                            <Divider/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ flex: 1, overflow: 'auto' }}>
                        <Grid item xs={12}>
                            {props.activeStep === 0 &&
                                <Organizations
                                    org={props.org}
                                    literals={props.literals}
                                    inputField={props.inputField}
                                    setInputField={props.setInputField}
                                />
                            }
                            {props.activeStep === 1 && 
                                <Cities
                                    org={props.org}
                                    literals={props.literals}
                                    inputField={props.inputField}
                                    setInputField={props.setInputField}
                                />
                            }
                            {props.activeStep === 2 && 
                                <Zones
                                    org={props.org}
                                    literals={props.literals}
                                    inputField={props.inputField}
                                    setInputField={props.setInputField}
                                />
                            }
                            {props.activeStep === 3 && 
                                <Plates
                                    org={props.org}
                                    literals={props.literals}
                                    inputField={props.inputField}
                                    setInputField={props.setInputField}
                                />
                            }
                            {props.activeStep === 4 && 
                                <Tickets
                                    org={props.org}
                                    literals={props.literals}
                                    inputField={props.inputField}
                                    setInputField={props.setInputField}
                                />
                            }
                            {props.activeStep === 5 && 
                                <PublicNotes
                                    org={props.org}
                                    literals={props.literals}
                                    inputField={props.inputField}
                                    setInputField={props.setInputField}
                                />
                            }
                            {props.activeStep === 6 && 
                                <PrivateNotes
                                    org={props.org}
                                    literals={props.literals}
                                    inputField={props.inputField}
                                    setInputField={props.setInputField}
                                />
                            }
                            {props.activeStep === 7 &&
                                <Image
                                    inputField={props.inputField}
                                    setInputField={props.setInputField}
                                />
                            }
                            {props.activeStep === 8 && 
                                <Summary
                                    literals={props.literals}
                                    inputField={props.inputField}
                                    setTicketIssued={(e)=>props.setTicketIssued(e)}
                                />
                            }
                        </Grid>
                    </Grid>
                    <Grid container sx={{ placeContent: "center", flex: '0 0 auto' }}>
                        <Grid item xs={12}>
                            <Divider/>
                        </Grid>
                        
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { ReactComponent as CreateIcon } from '../../../assets/create-24px.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/delete-24px.svg';
import { Referral } from '../../types/referral';
import { CountryType } from '../../types/country';
import { IconButton } from '../IconButton';
import style from './ReferralTable.module.css';
import { countries } from '../../data/countries';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
      },
    },
    option: {
      fontSize: 15,
      '& > span': {
        marginRight: 10,
        fontSize: 18,
      },
    }
  }),
);

const TableHeadCell: React.FC = ({ children }) => (
  <TableCell classes={{ root: style.tableHeadCell }}>{children}</TableCell>
);

const TableBodyCell: React.FC = ({ children }) => (
  <TableCell classes={{ root: style.tableBodyCell }}>{children}</TableCell>
);

const TableAddressCell: React.FC = ({ children }) => (
  <TableCell classes={{ root: style.addressCell }}>{children}</TableCell>
);

interface ActionBodyCellProps {
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const ActionBodyCell: React.FC<ActionBodyCellProps> = ({
                                                         onEditClick,
                                                         onDeleteClick,
                                                       }) => (
  <TableCell classes={{ root: style.actionBodyCell }}>
    <IconButton onClick={onEditClick}>
      <CreateIcon />
    </IconButton>
    <IconButton onClick={onDeleteClick}>
      <DeleteIcon />
    </IconButton>
  </TableCell>
);

interface ReferralTableProps {
  referrals: Referral[];
}

function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

const ReferralTable: React.FC<ReferralTableProps> = ({ referrals }) => {
  const classes = useStyles();
  const [currentReferrals, setReferrals] = React.useState(referrals);
  const [openEditDialog, setEditDialog] = React.useState(false);
  const [openDeleteDialog, setDeleteDialog] = React.useState(false);
  const [openAddDialog, setAddDialog] = React.useState(false);
  const [focus, setFocus] = React.useState(null);
  const [editFormData, setEditFormData] = React.useState({
    givenName: "",
    surName: "",
    email: "",
    phone: "",
    addressLine: "",
    suburb: "",
    state: "",
    postCode: "",
    country: ""
  });
  const [addFormData, setAddFormData] = React.useState({
    givenName: "",
    surName: "",
    email: "",
    phone: "",
    addressLine: "",
    suburb: "",
    state: "",
    postCode: "",
    country: ""
  });
  const [editFormErrors, setEditFormErrors] = React.useState({});
  const [addFormErrors, setAddFormErrors] = React.useState({});
  const [editFormCountry, setEditFormCountry] = React.useState('');
  const [addFormCountry, setAddFormCountry] = React.useState('');

  const handleDelete = () => {
    setDeleteDialog(false);
    setReferrals(currentReferrals.filter(ref => ref.id !== focus.id));
  };

  const cancelDelete = () => {
    setDeleteDialog(false);
  };

  const cancelEdit = () => {
    setEditDialog(false);
  };

  const cancelAdd = () => {
    setAddDialog(false);
  }

  // new referral button
  const handleNewReferral = (event) => {
    event.preventDefault();
    setAddFormErrors({});
    setAddDialog(true);
  }

  // form init
  const initEditForm = (id: number) => {
    const editReferral = currentReferrals.find(ref => ref.id === id);
    const newFormData = {
      givenName: editReferral.givenName,
      surName: editReferral.surName,
      phone: editReferral.phone,
      email: editReferral.email,
      addressLine: editReferral.addressLine,
      suburb: editReferral.suburb,
      state: editReferral.state,
      postCode: editReferral.postCode,
      country: editReferral.country
    };
    setEditFormData(newFormData);
  }

  // form changes
  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    validateAddForm(event, fieldName, fieldValue);

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    validateEditForm(event, fieldName, fieldValue);

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleAddFormCountryChange = (event, value: CountryType) => {
    setAddFormCountry(value?.label);

    if (!value) {
      setAddFormErrors({
        ...addFormErrors,
        country: 'Country is mandatory'
      });
    } else {
      const newError = { ...addFormErrors };
      delete newError['country'];
      setAddFormErrors(newError);
    };
  }

  const handleEditFormCountryChange = (event, value: CountryType) => {
    setEditFormCountry(value?.label);

    if (!value) {
      setEditFormErrors({
        ...editFormErrors,
        country: 'Country is mandatory'
      });
    } else {
      const newError = { ...editFormErrors };
      delete newError['country'];
      setEditFormErrors(newError);
    };
  }

  // form submit
  const handleAddFormSubmit = (event) => {
    event.preventDefault();
    
    const newReferral = {
      id: currentReferrals?.length ? currentReferrals[currentReferrals.length - 1].id + 1 : 1,
      givenName: addFormData.givenName,
      surName: addFormData.surName,
      phone: addFormData.phone,
      email: addFormData.email,
      addressLine: addFormData.addressLine,
      suburb: addFormData.suburb,
      state: addFormData.state,
      postCode: addFormData.postCode,
      country: addFormCountry
    };

    const newReferrals = [...currentReferrals, newReferral];
    setReferrals(newReferrals);
    setAddDialog(false);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedReferral = {
      id: focus.id,
      givenName: editFormData.givenName,
      surName: editFormData.surName,
      phone: editFormData.phone,
      email: editFormData.email,
      addressLine: editFormData.addressLine,
      suburb: editFormData.suburb,
      state: editFormData.state,
      postCode: editFormData.postCode,
      country: editFormCountry
    };

    const newReferrals = [...currentReferrals];

    const index = currentReferrals.findIndex((ref) => ref.id === focus.id);

    newReferrals[index] = editedReferral;

    setReferrals(newReferrals);
    setEditDialog(false);
  };

  // form validation
  const validateEditForm = (event, name, value) => {
    switch (name) {
      case 'givenName':
        if (!value?.length) {
          setEditFormErrors({
            ...editFormErrors,
            givenName: 'Given Name is mandatory'
          });
        } else {
          const newError = { ...editFormErrors };
          delete newError['givenName'];
          setEditFormErrors(newError);
        }
        break;
      case 'surName':
        if (!value?.length) {
          setEditFormErrors({
            ...editFormErrors,
            surName: 'Surname is mandatory'
          });
        } else {
          const newError = { ...editFormErrors };
          delete newError['surName'];
          setEditFormErrors(newError);
        }
        break; 
      case 'email':
        if (!new RegExp( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)) {
          setEditFormErrors({
            ...editFormErrors,
            email: 'Please enter a valid email'
          });
        } else {
          const newError = { ...editFormErrors };
          delete newError['email'];
          setEditFormErrors(newError);
        }
        break;
      case 'phone':
        if (!new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).test(value)) {
          setEditFormErrors({
            ...editFormErrors,
            phone: 'Please enter a valid phone number'
          });
        } else {
          const newError = { ...editFormErrors };
          delete newError['phone'];
          setEditFormErrors(newError);
        }
        break;
      case 'addressLine':
        if (!value?.length) {
          setEditFormErrors({
            ...editFormErrors,
            addressLine: 'Address Line is mandatory'
          });
        } else {
          const newError = { ...editFormErrors };
          delete newError['addressLine'];
          setEditFormErrors(newError);
        }
        break;
      case 'suburb':
        if (!value?.length) {
          setEditFormErrors({
            ...editFormErrors,
            suburb: 'Suburb is mandatory'
          });
        } else {
          const newError = { ...editFormErrors };
          delete newError['suburb'];
          setEditFormErrors(newError);
        }
        break;
      case 'state':
        if (!value?.length) {
          setEditFormErrors({
            ...editFormErrors,
            state: 'State is mandatory'
          });
        } else {
          const newError = { ...editFormErrors };
          delete newError['state'];
          setEditFormErrors(newError);
        }
        break;
      case 'postCode':
        if (!new RegExp(/^[0-9]{4,10}$/).test(value)) {
          setEditFormErrors({
            ...editFormErrors,
            postCode: 'Please enter a valid postcode'
          });
        } else {
          const newError = { ...editFormErrors };
          delete newError['postCode'];
          setEditFormErrors(newError);
        }
        break;
      case 'country':
        if (!value?.length) {
          setEditFormErrors({
            ...editFormErrors,
            country: 'Country is mandatory'
          });
        } else {
          const newError = { ...editFormErrors };
          delete newError['country'];
          setEditFormErrors(newError);
        }
        break;
    }
  }

  const validateAddForm = (event, name, value) => {
    switch (name) {
      case 'givenName':
        if (!value?.length) {
          setAddFormErrors({
            ...addFormErrors,
            givenName: 'Given Name is mandatory'
          });
        } else {
          const newError = { ...addFormErrors };
          delete newError['givenName'];
          setAddFormErrors(newError);
        }
        break;
      case 'surName':
        if (!value?.length) {
          setAddFormErrors({
            ...addFormErrors,
            surName: 'Surname is mandatory'
          });
        } else {
          const newError = { ...addFormErrors };
          delete newError['surName'];
          setAddFormErrors(newError);
        }
        break; 
      case 'email':
        if (!new RegExp( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)) {
          setAddFormErrors({
            ...addFormErrors,
            email: 'Please enter a valid email'
          });
        } else {
          const newError = { ...addFormErrors };
          delete newError['email'];
          setAddFormErrors(newError);
        }
        break;
      case 'phone':
        if (!new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).test(value)) {
          setAddFormErrors({
            ...addFormErrors,
            phone: 'Please enter a valid phone number'
          });
        } else {
          const newError = { ...addFormErrors };
          delete newError['phone'];
          setAddFormErrors(newError);
        }
        break;
      case 'addressLine':
        if (!value?.length) {
          setAddFormErrors({
            ...addFormErrors,
            addressLine: 'Address Line is mandatory'
          });
        } else {
          const newError = { ...addFormErrors };
          delete newError['addressLine'];
          setAddFormErrors(newError);
        }
        break;
      case 'suburb':
        if (!value?.length) {
          setAddFormErrors({
            ...addFormErrors,
            suburb: 'Suburb is mandatory'
          });
        } else {
          const newError = { ...addFormErrors };
          delete newError['suburb'];
          setAddFormErrors(newError);
        }
        break;
      case 'state':
        if (!value?.length) {
          setAddFormErrors({
            ...addFormErrors,
            state: 'State is mandatory'
          });
        } else {
          const newError = { ...addFormErrors };
          delete newError['state'];
          setAddFormErrors(newError);
        }
        break;
      case 'postCode':
        if (!new RegExp(/^[0-9]{4,10}$/).test(value)) {
          setAddFormErrors({
            ...addFormErrors,
            postCode: 'Please enter a valid postcode'
          });
        } else {
          const newError = { ...addFormErrors };
          delete newError['postCode'];
          setAddFormErrors(newError);
        }
        break;
      case 'country':
        if (!value?.length) {
          setAddFormErrors({
            ...addFormErrors,
            country: 'Country is mandatory'
          });
        } else {
          const newError = { ...addFormErrors };
          delete newError['country'];
          setAddFormErrors(newError);
        }
        break;
    }
  }

   // button diabled
  const isEditButtonDisabled  = () => {
    return Object.keys(editFormErrors)?.length ? true : false;
  }

  const isAddButtonDisabled  = () => {
    if (Object.keys(addFormErrors)?.length) {
      return true;
    } else {
      const fields = Object.keys(addFormData).filter(field => field !== 'country');
      if (!addFormCountry) {
        return true;
      }
      for (let field of fields) {
        if (!addFormData[field]) {
          return true;
        }
      }
      return false;
    } 
  }

  return (
    <div>
      <TableContainer classes={{ root: style.container }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Given Name</TableHeadCell>
              <TableHeadCell>Surname</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Phone</TableHeadCell>
              <TableHeadCell>Address</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentReferrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableBodyCell>{referral.givenName}</TableBodyCell>
                <TableBodyCell>{referral.surName}</TableBodyCell>
                <TableBodyCell>{referral.email}</TableBodyCell>
                <TableBodyCell>{referral.phone}</TableBodyCell>
                <TableAddressCell>
                  {referral.addressLine + ' ' + referral.suburb + ' ' + referral.state + ' '  + referral.postCode + ' '  + referral.country}
                </TableAddressCell>
                <ActionBodyCell
                  onEditClick={() => {
                      setFocus(referral);
                      setEditDialog(true);
                      setEditFormErrors({});
                      initEditForm(referral.id);
                    }
                  }
                  onDeleteClick={() => {
                      setFocus(referral);
                      setDeleteDialog(true);
                    }
                  }
                />

                <Dialog open={openDeleteDialog}>
                    <DialogTitle>Delete Referral</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Are you sure to delete {focus?.givenName + ' ' + focus?.surName}?</DialogContentText>
                        <DialogActions>                      
                            <Button onClick={handleDelete} color="primary" variant="contained">
                                Delete
                            </Button>
                            <Button onClick={cancelDelete} color="primary" variant="outlined">
                                Cancel
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>

                <Dialog open={openEditDialog}>
                    <DialogTitle>Edit Referral</DialogTitle>
                    <DialogContent>
                      <form className={classes.root} onSubmit={handleEditFormSubmit}>
                        
                        <TextField
                          type="text"
                          name="givenName"
                          required
                          fullWidth
                          label="Given Name"
                          value={editFormData.givenName}
                          placeholder="Enter a given name..."
                          onChange={handleEditFormChange}
                        />
                        {
                          editFormErrors['givenName'] && <div className={style.textWarning}>{editFormErrors['givenName']}</div>
                        }
                        
                        <TextField
                          type="text"
                          name="surName"
                          required
                          fullWidth
                          label="Surname"
                          value={editFormData.surName}
                          placeholder="Enter a surname..."
                          onChange={handleEditFormChange}
                        />
                        {
                          editFormErrors['surName'] && <div className={style.textWarning}>{editFormErrors['surName']}</div>
                        }
                      
                        <TextField
                            type="email"
                            name="email"
                            required
                            label="Email"
                            fullWidth
                            value={editFormData.email}
                            placeholder="Enter an email..."
                            onChange={handleEditFormChange}
                          />
                          {
                            editFormErrors['email'] && <div className={style.textWarning}>{editFormErrors['email']}</div>
                          }
                          <TextField
                            type="text"
                            name="phone"
                            required
                            label="Phone"
                            fullWidth
                            value={editFormData.phone}
                            placeholder="Enter a phone number..."
                            onChange={handleEditFormChange}
                          />     
                          {
                            editFormErrors['phone'] && <div className={style.textWarning}>{editFormErrors['phone']}</div>
                          } 
                          <TextField
                            type="text"
                            name="addressLine"
                            required
                            label="Address Line"
                            fullWidth
                            value={editFormData.addressLine}
                            placeholder="Enter an address..."
                            onChange={handleEditFormChange}
                          />  
                        {
                          editFormErrors['addressLine'] && <div className={style.textWarning}>{editFormErrors['addressLine']}</div>
                        } 

                        <div>
                          <TextField
                            type="text"
                            name="suburb"
                            required
                            label="Suburb"
                            value={editFormData.suburb}
                            placeholder="Enter a suburb..."
                            onChange={handleEditFormChange}
                          />                       
                          <TextField
                            type="text"
                            name="state"
                            required
                            label="State"
                            value={editFormData.state}
                            placeholder="Enter a state..."
                            onChange={handleEditFormChange}
                          />
                          <TextField
                            type="text"
                            name="postCode"
                            required
                            label="Postcode"
                            value={editFormData.postCode}
                            placeholder="Enter a postcode..."
                            onChange={handleEditFormChange}
                          />
                          {
                          editFormErrors['suburb'] && <div className={style.textWarning}>{editFormErrors['suburb']}</div>
                          } 
                          {
                          editFormErrors['state'] && <div className={style.textWarning}>{editFormErrors['state']}</div>
                          } 
                          {
                          editFormErrors['postCode'] && <div className={style.textWarning}>{editFormErrors['postCode']}</div>
                          }
                        </div>

                        <Autocomplete
                          options={countries as CountryType[]}
                          classes={{
                            option: classes.option,
                          }}
                          autoHighlight
                          getOptionLabel={(option) => option.label}
                          onChange={handleEditFormCountryChange}
                          defaultValue={countries.find((obj) => obj.label === focus?.country)}
                          renderOption={(option) => (
                            <React.Fragment>
                              <span>{countryToFlag(option.code)}</span>
                              {option.label}
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Country"
                              required
                              placeholder="Select a country..."
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                          
                        {
                        editFormErrors['country'] && <div className={style.textWarning}>{editFormErrors['country']}</div>
                        } 
                        
                      </form>

                      <DialogActions>  
                          <Button type="submit" onClick={handleEditFormSubmit} disabled={isEditButtonDisabled()} color="primary" variant="contained">
                              Confirm
                          </Button>                      
                          <Button onClick={cancelEdit} color="primary" variant="outlined">
                              Cancel
                          </Button>
                      </DialogActions>
                    </DialogContent>
                </Dialog>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button color="primary" variant="contained" className={style.newButton} onClick={handleNewReferral}> Create New </Button>
      </TableContainer>
      <Dialog open={openAddDialog}>
          <DialogTitle>Add a Referral</DialogTitle>
          <DialogContent>
            <form className={classes.root} onSubmit={handleAddFormSubmit}>
              <TextField
                type="text"
                name="givenName"
                required
                fullWidth
                label="Given Name"
                placeholder="Enter a given name..."
                onChange={handleAddFormChange}
              />
              {
                addFormErrors['givenName'] && <div className={style.textWarning}>{addFormErrors['givenName']}</div>
              }
              <TextField
                type="text"
                name="surName"
                required
                fullWidth
                label="Surname"
                placeholder="Enter a surname..."
                onChange={handleAddFormChange}
              />
              {
                addFormErrors['surName'] && <div className={style.textWarning}>{addFormErrors['surName']}</div>
              }
           
              <TextField
                  type="email"
                  name="email"
                  required
                  label="Email"
                  placeholder="Enter an email..."
                  onChange={handleAddFormChange}
                  fullWidth
                />
                {
                addFormErrors['email'] && <div className={style.textWarning}>{addFormErrors['email']}</div>
              }
                <TextField
                  type="text"
                  name="phone"
                  required
                  label="Phone"
                  placeholder="Enter a phone number..."
                  onChange={handleAddFormChange}
                  fullWidth
                /> 
                {
                addFormErrors['phone'] && <div className={style.textWarning}>{addFormErrors['phone']}</div>
              }      

                 <TextField
                    type="text"
                    name="addressLine"
                    required
                    label="Address Line"
                    fullWidth
                    placeholder="Enter an address..."
                    onChange={handleAddFormChange}
                  />  
                  {
                  addFormErrors['addressLine'] && <div className={style.textWarning}>{addFormErrors['addressLine']}</div>
                  } 

                  <div>
                    <TextField
                      type="text"
                      name="suburb"
                      required
                      label="Suburb"
                      placeholder="Enter a suburb..."
                      onChange={handleAddFormChange}
                    />
                    <TextField
                      type="text"
                      name="state"
                      required
                      label="State"
                      placeholder="Enter a state..."
                      onChange={handleAddFormChange}
                    />
                    <TextField
                      type="text"
                      name="postCode"
                      required
                      label="Postcode"
                      placeholder="Enter a postcode..."
                      onChange={handleAddFormChange}
                    />
                    {
                    addFormErrors['suburb'] && <div className={style.textWarning}>{addFormErrors['suburb']}</div>
                    }
                    {
                    addFormErrors['state'] && <div className={style.textWarning}>{addFormErrors['state']}</div>
                    }
                    {
                    addFormErrors['postCode'] && <div className={style.textWarning}>{addFormErrors['postCode']}</div>
                    }
                  </div>

                    <Autocomplete
                      options={countries as CountryType[]}
                      classes={{
                        option: classes.option,
                      }}
                      autoHighlight
                      getOptionLabel={(option) => option.label}
                      onChange={handleAddFormCountryChange}
                      renderOption={(option) => (
                        <React.Fragment>
                          <span>{countryToFlag(option.code)}</span>
                          {option.label}
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Country"
                          required
                          placeholder="Select a country..."
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                    {
                    addFormErrors['country'] && <div className={style.textWarning}>{addFormErrors['country']}</div>
                    }
    
            </form>

            <DialogActions>                      
                <Button type="submit" onClick={handleAddFormSubmit} disabled={isAddButtonDisabled()} variant="contained" color="primary" >Create</Button>
                <Button onClick={cancelAdd} variant="outlined" color="primary">Cancel</Button>
            </DialogActions>
          </DialogContent>
      </Dialog>
    </div>
  );
};

export { ReferralTable };

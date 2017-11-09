const dictionary: any = {
    // Common
    'user':                    'User',
    'building':                'Building',
    'note':                    'Notes',
    'rentedOut':               'Rented Out',
    'suite':                   'Unit',
    'suite_user':              'Suite User',
    'name':                    'Name',

    // Unit
    'suiteNumber':             'Unit Number',
    'emergencyContact':        'Emergency Contact',
    'proportionateShare':      'Prop. Share %',
    'buzz':                    'Buzz',
    'keyCode':                 'Key Code',
    'keyFob':                  'Key Fob',
    'powerAttorney':           'Power Attorney',
    'legalDescription':        'Legal Description',
    'allowedVisitor':          'Allowed Visitors',

    // Resident
    'isPrimaryAddress':        'Primary Address',
    'isPrimaryPhone':          'Primary Phone',
    'role':                    'Occupant Type',
    'rent':                    'Tenant',
    'owner_off':               'Owner Off-Site',
    'owner_on':                'Owner On-Site',
    'unknown':                 'Not set',
    'fullName':                'Full Name',
    'email':                   'Email',
    'address':                 'Address',
    'emailWaiverSigned':       'Email Waiver Signed',
    'parcelWaiverSigned':      'Parcel Waiver Signed',
    'keyWaiverSigned':         'Key Waiver Signed',

    'phone':                   'Phone',
    'phoneType':               'Phone Type',
    'phone_home':              'Home',
    'phone_cell':              'Cell',
    'phone_business':          'Phone Business',
    'phone_fax':               'Fax',
    'phone_business_fax':      'Business Fax',
    'phone_other':             'Other',

    'city':                    'City',
    'dateOfBirth':             'DOB',
    'countryName':             'Country',
    'state':                   'Province / State',
    'postalCode':              'Postal Code',
    'emergencyAssistantNotes': 'Emergency Notes',

    // Parking spot
    'parkingNumber':           'Parking Spot',
    'rentedTo':                'Rented To',
    'garageRemote':            'Garage Remote',
    'handicap':                'Handicap',

    // Lockers
    'lockerKeyCode':           'Locker Spot',

    // Vehicle
    'licensePlate':            'License Plate #',
    'year':                    'Year',
    'color':                   'Color',
    'model':                   'Model',
    'brand':                   'Make',
    'ownerName':               'Owner Name',

    // Pet
    'weight':                  'Weight',
    'height':                  'Height',
    'breed':                   'Breed',

    // Rack number
    'rackNumber':              'Rack #',
    'bike_rack':               'Bike Rack',
    'locker':                  'Locker',
    'parking':                 'Parking',
    'pet':                     'Pet',
    'resident':                'Resident',
    'resident_address':        'Resident Address',
    'resident_phone':          'Resident Phone',
    'vehicle':                 'Vehicle',

    // Parcels
    'parcels':                 'Parcel',
    'parcelNumber':            'Parcel Number',
    'barCode':                 'Bar Code',
    'numberPieces':            'Number Pieces',
    'description':             'Description',
    'status':                  'Status',
    'inOut':                   'InOut',
    'createdAt':               'CreatedAt',
    'emailNotice':             'EmailNotice',
    'parcelPostService':       'Courier',

};

export class ActivityDictionary {
    static getValue(key: string): string {
        return dictionary[key] || key;
    }
}

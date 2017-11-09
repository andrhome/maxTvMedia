export class Building {
    constructor(
        public id: string = null,
        public name: string = '',
        public address: string = '',
        public suites: Array<number> = []
    ) {}
}
export class Group {
    constructor(
        public id: string = null,
        public itemName: string = '',
        public users: Array<number> = []
    ) {}
}

export class Suite {
    constructor(
        public id: number = null,
        public suiteNumber: string = '',
        public buildingId: number = null,
        public buildingName: string = ''
    ) {}
}
export class SuiteUser {
    constructor(
        public id: number,
        public role: string,
        public suite: string,
        public user: any
    ) {}
}
export class ResidentForSelect {
    constructor(
        public id: number,
        public fullName: string,
        public suiteUsers: Array<SuiteUser> = [],
        public email: string = ''
    ) {}
}
export class UserAddressType {
    constructor(
        public isPrimaryAddress: boolean = true,
        public country: number = null,
        public state: string = '',
        public city: string = '',
        public address: string = '',
        public postalCode: string = '',
        public user: number = null
    ) {}
}
export class UserPhoneType {
    constructor(
        public isPrimaryPhone: boolean = true,
        public phone: string = '',
        public phoneType: string = 'phone_home',
        public user: number = null
    ) {}
}
export class Resident {
    constructor(
        public id: number = null,
        public suiteUserId: number = null,
        public email: string = '',
        public fullName: string = '',
        public dateOfBirth: string = '',
        public addresses: Array<UserAddressType> = [],
        public phones: Array<UserPhoneType> = [],
        public groups: Array<any> = [],
        public emergencyContact: string = '',
        public emergencyAssistantNotes: string = '',
        public role: string = 'unknown',
        public emailWaiverSigned: number = 0,
        public parcelWaiverSigned: number = 0,
        public keyWaiverSigned: number = 0,
        public maxTvUser: number = 0,

        public suiteId: number = null,
        public suiteNumber: string = '',
        public buildingId: number = null,
        public buildingName: string = '',

        public checked: boolean = false,

        public formFields = {
            email:                   { editMode: false},
            fullName:                { editMode: false},
            dateOfBirth:             { editMode: false},
            addresses:               { editMode: false},
            phones:                  { editMode: false},
            groups:                  { editMode: false},
            emergencyContact:        { editMode: false},
            emergencyAssistantNotes: { editMode: false},
            role:                    { editMode: false},
            emailWaiverSigned:       { editMode: false},
            parcelWaiverSigned:      { editMode: false},
            keyWaiverSigned:         { editMode: false},
            maxTvUser:               { editMode: false},
        }
    ) {}
}
export class Unit {
    constructor(
        public id: number = null,
        public buildingId: number = null,
        public buildingName: string = '',
        public suiteNumber: string = '',
        public buzz: string = '',
        public proportionateShare: string = '',
        public emergencyContact: string = '',
        public legalDescription: string = '',
        public enterPhone: string = '',
        public keyFob: string = '',
        public keyCode: string = '',
        public powerAttorney: string = '',
        public allowedVisitor: string = '',
        public note: string = '',
        public rentedOut: number = 0,
        public fromFiveReceived: string = '',
        public occupancyDate: string = '',
        public suiteUser: Array<SuiteUser> = [],
        public parking: Array<number> = [],
        public locker: Array<number> = [],
        public bikeRack: Array<number> = [],
        public pet: Array<number> = [],

        public checked: boolean = false,

        public formFields = {
            building:           { editMode: false},
            suiteNumber:        { editMode: false},
            buzz:               { editMode: false},
            proportionateShare: { editMode: false},
            emergencyContact:   { editMode: false},
            legalDescription:   { editMode: false},
            enterPhone:         { editMode: false},
            keyFob:             { editMode: false},
            keyCode:            { editMode: false},
            powerAttorney:      { editMode: false},
            allowedVisitor:     { editMode: false},
            note:               { editMode: false},
            rentedOut:          { editMode: false},
            fromFiveReceived:   { editMode: false},
            occupancyDate:      { editMode: false},
        }
    ) {}
}

export class ParkingSpot {
    constructor(
        public id: number = null,
        public parkingNumber: string = '',
        public legalDescription: string = '',
        public rentedOut: number = 0,
        public rentedTo: string = '',
        public garageRemote: string = '',
        public handicap: string = '',
        public note: string = '',

        public suiteId: number = null,
        public suiteNumber: string = '',
        public buildingId: number = null,
        public buildingName: string = '',

        public checked: boolean = false,

        public formFields = {
            location:         { editMode: false},
            parkingNumber:    { editMode: false},
            rentedOut:        { editMode: false},
            rentedTo:         { editMode: false},
            garageRemote:     { editMode: false},
            handicap:         { editMode: false},
            legalDescription: { editMode: false},
            note:             { editMode: false}
        }
    ) {}
}
export class Locker {
    constructor(
        public id: number = null,
        public legalDescription: string = '',
        public lockerKeyCode: string = '',
        public rentedOut: number = 0,
        public rentedTo: string = '',
        public note: string = '',

        public suiteId: number = null,
        public suiteNumber: string = '',
        public buildingId: number = null,
        public buildingName: string = '',

        public checked: boolean = false,

        public formFields = {
            legalDescription: { editMode: false},
            lockerKeyCode:    { editMode: false},
            rentedOut:        { editMode: false},
            rentedTo:         { editMode: false},
            note:             { editMode: false},
        }
    ) {}
}
export class Vehicle {
    constructor(
        public id: number = null,
        public licensePlate: string = '',
        public year: string = '',
        public color: string = '',
        public note: string = '',
        public brand: string = '',
        public model: string = '',
        public ownerId: number = null,
        public ownerName: string = '',

        public suiteId: number = null,
        public suiteNumber: string = '',
        public buildingId: number = null,
        public buildingName: string = '',

        public checked: boolean = false,

        public formFields = {
            licensePlate: { editMode: false},
            year:         { editMode: false},
            color:        { editMode: false},
            note:         { editMode: false},
            brand:        { editMode: false},
            model:        { editMode: false},
            ownerId:      { editMode: false},
        }
    ) {}
}
export class Pet {
    constructor(
        public id: number = null,
        public name: string = '',
        public petTypeId: number = null,
        public petTypeName: string = '',
        public weight: string = '',
        public height: string = '',
        public dateOfBirth: string = '',
        public breed: string = '',
        public note: string = '',

        public suiteId: number = null,
        public suiteNumber: string = '',
        public buildingId: number = null,
        public buildingName: string = '',

        public checked: boolean = false,

        public formFields = {
            name:        { editMode: false},
            petTypeId:   { editMode: false},
            weight:      { editMode: false},
            height:      { editMode: false},
            dateOfBirth: { editMode: false},
            breed:       { editMode: false},
            note:        { editMode: false},
        }
    ) {}
}
export class BikeRack {
    constructor(
        public id: number = null,
        public rackNumber: string = '',
        public rentedOut: number = 0,
        public rentedTo: string = '',
        public note: string = '',

        public suiteId: number = null,
        public suiteNumber: string = '',
        public buildingId: number = null,
        public buildingName: string = '',

        public checked: boolean = false,

        public formFields = {
            rackNumber: { editMode: false},
            rentedOut:  { editMode: false},
            rentedTo:   { editMode: false},
            note:       { editMode: false},
        }
    ) {}
}

export class Parcel {
    constructor(
        public id: number = null,
        public suiteId: number = null,
        public suiteNumber: string = '',
        public parcelTypeId: number = null,
        public parcelTypeName: string = '',
        public parcelPostServiceId: number = null,
        public parcelPostServiceName: string = '',
        public returningById: string = '',
        public returningByName: string = '',
        public buildingId: number = null,
        public buildingName: string = '',
        public residentId: number = null,
        public residentFullName: string = '',
        public residentEmail: string = '',
        public receivedById: number = null,
        public receivedByFullName: string = '',
        public receivedByEmail: string = '',
        public pickedUpById: number = null,
        public pickedUpByFullName: string = '',
        public pickedUpByEmail: string = '',
        public deliveredById: number = null,
        public deliveredByFullName: string = '',
        public deliveredByEmail: string = '',
        public barCode: string = '',
        public numberPieces: number = null,
        public deliveryAddress: string = '',
        public description: string = '',
        public notes: string = '',
        public status: string = '',
        public inOut: string = 'Incoming',
        public createdAt: string = '',
        public pickedUpAt: string = '',
        public pickedUpByPostService: string = '',
        public pickedUpByPostServiceName: string = '',
        public parcelHistory: Array<number> = [],
        public parcelNumber: string = '',
        public signUrl: string = '',
        public emailNotice: boolean = false,
        public checked: boolean = false
    ) {}

    isIncomingParcel() { return this.inOut === 'Incoming'; }
    isOutgoingParcel() { return this.inOut === 'Outgoing'; }
}

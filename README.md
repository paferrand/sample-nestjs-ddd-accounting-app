# Hello devs 🚀

Here is a simple Accounting application implemented with Typescript and Nest.js framework with a Domain-driven-development approach.

This is a server-side application that provides several ReST endpoints that help accounters to calculate VAT or the handle large amount of transactions that need to be validated before being registered, stored and declared to financial services.

An excellent DDD documentation can be found here https://github.com/ddd-by-examples/library

An interesting DDD implementation very well documented can be found here https://github.com/bitloops/ddd-hexagonal-cqrs-es-eda

NB: This repositories is here for fun purpose only, it does not intend to solve real-world problems.

## Features

- **TypeScript**: Strongly typed language for building scalable applications.
- **Domain-Driven Design (DDD)**: Focus on the core domain and domain logic.
- **DTO and Decorators**: Use of Data Transfer Objects and decorators for validation.
- **Jest**: Testing framework for unit and integration tests.
- **Pipes and Validation Pipes**: Data transformation and validation.
- **Sequelize**: Basic implementation for ORM with Node.js.

## Application Overview

### The Layers

The application is structured into several layers, each with a specific responsibility:

1. **Module Layer**: Organizes the application's structure by grouping services, providers, and controllers.
2. **Application Layer**: Manages incoming HTTP requests, defines routes, and groups application services.
3. **Domain Layer**: Contains business logic and repositories.
4. **Infrastructure Layer**: Provides data-related services such as database management.

### Domain Layer

This layer groups all the business logic.

#### MovementsValidatorService

This service validates a transaction list according to a provided points of controls.

A control point is a `date` and a `balance` couple,

A transaction contains several informations, but we focus on the `amount` and the `type` (payin or payout) information in this service.

The service will link the number of transactions made before within two points of control, calculate the sum of the corresponding transactions `amount`, and then compares it to the expected point of control `balance`.

In case of equality, the amounts of the provided transactions match the expected amount; otherwise, it means there are either missing transactions or extra transactions.

The service returns an object containing all duplicated transactions `duplicatedTransactions`, the sum of the amounts of received and debited transactions, the expected amount `expectedBalance`, the total amount actually provided `providedBalance`, and the `difference` between the two.

Constraints:

- It is not possible to validate all operations since the creation of the bank account. It must be possible to validate operations between two control points.
- The service considers that any transaction with the combination `date+amount+vatRate+description` is unique and thus allows identifying potential duplicate transactions.
- Transactions without a start control point and an end control point are not processed.
- If there is a duplicate transaction, the balance is calculated by removing the duplicate(s).
- It is not necessary to stop the operation control when a control point has not been validated. A set of operations can be validated.

#### VatCalculatorService

This is the service for calculating the VAT amounts to be collected.

For a list of transactions `TransactionEntity`, the service will return the total VAT amount that has been received `vatPayinAmount`, the total VAT amount that has been paid out `vatPayoutAmount`, and the VAT amount to be collected `vatToCollectAmount`.

To do this, the service calculates for each transaction the amount excluding tax `amountNetOfTaxes` and the VAT amount `vatAmount` from its VAT rate `vatRate`, the total amount including tax `amount`, and the type of operation `type`, which can be either a receipt `payin` or a debit `payout`.

### Infrastructure Layer

This layer manages interactions with an SQLite database using Sequelize.
It includes the different `models` representing the data and the `repositories` that execute SQL queries.
A seeder service allows initializing the data by inserting a dataset into the database.

### Application Layer

### The Endpoints

- **POST /movements/validation**:
  This is the endpoint that meets the requirements you sent me. It expects a `MovementsDTO` containing transactions and balances.
  It returns a response in the form of a JSON string containing information about the validity of the sent movements.

```bash
###
### Example of possible calls
###
## Duplicate transactions
curl -X POST http://localhost:3000/movements/validation -H "Content-Type: application/json" -d '{"transactions":[{"vatRate":10,"amount":100,"date":"2023-11-11","description":"sellprestation","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"},{"vatRate":10,"amount":100,"date":"2023-11-11","description":"sellprestation","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"},{"vatRate":20,"amount":110,"date":"2023-11-11","description":"sellprestation1","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"}],"balances":[{"date":"2024-11-31","amount":300}]}'

## Invalid balances
curl -X POST http://localhost:3000/movements/validation -H "Content-Type: application/json" -d '{"transactions":[{"vatRate":10,"amount":100,"date":"2023-11-11","description":"test","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"},{"vatRate":20,"amount":100,"date":"2023-11-11","description":"sellprestation","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"},{"vatRate":20,"amount":110,"date":"2023-11-11","description":"sellprestation1","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"}],"balances":[{"date":"2024-11-31","amount":300}]}'

## Valid movements
curl -X POST http://localhost:3000/movements/validation -H "Content-Type: application/json" -d '{"transactions":[{"vatRate":10,"amount":100,"date":"2023-11-11","description":"test","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"},{"vatRate":20,"amount":100,"date":"2023-11-11","description":"sellprestation","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"},{"vatRate":20,"amount":110,"date":"2023-11-11","description":"sellprestation1","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"}],"balances":[{"date":"2024-11-31","amount":310}]}'

## Example with invalid request parameters
curl -X POST http://localhost:3000/movements/validation -H "Content-Type: application/json" -d '{"transactions":[{"vatRate":10,"amounts":100,"date":"2023-11-11","description":"test","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"},{"vatRate":20,"amount":100,"date":"2023-11-11","description":"sellprestation","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"},{"vatsRate":20,"amount":110,"date":"2023-11-11","desc":"sellprestation1","types":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"}],"balances":[{"date":"2024-11-31","amount":310}]}'
```

- **POST /movements/save** :
  This is the endpoint that allows adding the possibility to save movements in a database if the movements are valid. This allowed me to integrate Sequelize into the project.

```bash
### Example of possible call
curl -X POST http://localhost:3000/movements/save -H "Content-Type: application/json" -d '{"transactions":[{"vatRate":10,"amount":100,"date":"2023-11-11","description":"test","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"},{"vatRate":20,"amount":100,"date":"2023-11-11","description":"sellprestation","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"},{"vatRate":20,"amount":110,"date":"2023-11-11","description":"sellprestation1","type":"payin","bankAccountId":"bcffade8-f5f6-41b9-9aae-de4895e649ca"}],"balances":[{"date":"2024-11-31","amount":310}]}'
```

- **POST /taxes/vat** :
  This is an endpoint that accepts a list of `TransactionDTO` as input and will automatically calculate the VAT amount to be declared to the VAT collection service.

```bash
### Example of possible call
curl -X POST http://localhost:3000/taxes/vat -H "Content-Type: application/json" -d '{"transactions":[{"amount":100,"date":"2023-11-11","description":"test","type":"payin","vatRate":5.5},{"vatRate":20,"amount":100,"date":"2023-11-11","description":"test","type":"payin"},{"amount":110,"date":"2023-11-11","description":"sellprestation1","type":"payin","vatRate":10}]}'

### Example with invalid parameters
curl -X POST http://localhost:3000/taxes/vat -H "Content-Type: application/json" -d '{"transactions":[{"amount":100,"date":"2023-11-11","description":"test","type":"payin","vatsRate":5.5},{"vatRate":12.21111,"amount":100,"date":"2023-11-11","description":"test","type":"payin"},{"amount":110,"date":"2023-11-11","description":"sellprestation1","type":"payin","vatRate":10}]}'
```

#### DTO's

The use of DTOs in the `application` layer allows validating the integrity of the data sent by HTTP requests to enhance the security of the endpoints.

### Tests

Unit tests on the services of the `domain` layer are available to ensure that the business logic produces the expected results. These test files names end with `.spec.ts`

```bash
# Run the tests
npm test
# Run the tests in watch mode
npm test:watch
```

## Installation and Launching the Application

```bash
#
# INSTALLATION
#
# Install dependencies
npm install
#
# STARTING
#
# Start the application
npm start
# Start the application in development mode
npm start:dev
```

## Main Dependencies

- **@nestjs/core**
- **@nestjs/common**
- **@nestjs/config**
- **@nestjs/sequelize**
- **sequelize**
- **class-validator**
- **class-transformer**
- **dotenv**

# License

This project is licensed under the MIT License. See the [LICENSE](LICENCE) file for details.

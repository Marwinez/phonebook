const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
} else {
    const password = process.argv[2]

    const url = `mongodb+srv://Marwinez:${password}@marwinezbaza.zxbrp.mongodb.net/phonebook?
    retryWrites=true&w=majority&appName=phonebook`

    mongoose.set('strictQuery', false)

    mongoose.connect(url)

    const personSchema = new mongoose.Schema({
        id: String,
        name: String,
        number: String
    })
    
    const Person = mongoose.model('Person', personSchema)

    if (process.argv.length === 3) {
        console.log("phonebook:")
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
    } else {
        const name = process.argv[3]
        const number = process.argv[4]

        const person = new Person({
            id: String(Math.floor(Math.random() * 100)),
            name: name,
            number: number
        })

        person.save().then(result => {
            console.log(`added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
        })
    }

    
}








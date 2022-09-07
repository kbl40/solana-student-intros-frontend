import * as borsh from '@project-serum/borsh'
export class StudentIntro {
    name: string;
    message: string;

    constructor(name: string, message: string) {
        this.name = name;
        this.message = message;
    }

    static mocks: StudentIntro[] = [
        new StudentIntro('Elizabeth Holmes', `Learning Solana so I can use it to build sick NFT projects.`),
        new StudentIntro('Jack Nicholson', `I want to overhaul the world's financial system. Lower friction payments/transfer, lower fees, faster payouts, better collateralization for loans, etc.`),
        new StudentIntro('Terminator', `i'm basically here to protect`),
    ]

    // 1. Create the schema - order matters!
    borshInstructionSchema = borsh.struct([
        borsh.u8('variant'),
        borsh.str('name'),
        borsh.str('message')
    ])

    // 2. Create a method to handle the serializaton
    serialize(): Buffer {
        const buffer = Buffer.alloc(1000)
        this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer)
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }

    static borshAccountSchema = borsh.struct([
        borsh.u8('initialized'),
        borsh.str('name'),
        borsh.str('message')
    ])

    static deserialize(buffer?: Buffer): StudentIntro|null {
        if(!buffer) {
            return null
        }

        try {
            const { name, message } = this.borshAccountSchema.decode(buffer)
            return new StudentIntro(name, message)
        } catch (error) {
            console.log('Deserialization error:', error)
            return null
        }
    }
}
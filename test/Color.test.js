const { assert } = require('chai');

const Color = artifacts.require('./Color.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should()

describe('Color', (accounts) => {
    let contract;

    beforeEach(async () => {
        contract = await Color.deployed();
    })

    describe('deployment', async () => {
        
        it('deploy successfully', async () => {
            const address = contract.address;
            assert.notEqual(address, '');
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })

        it('has a name', async () => {
            const name = await contract.name();
            assert.equal(name, 'Color');
        })

        it('has a symbol', async () => {
            const name = await contract.symbol();
            assert.equal(name, 'COLOR');
        })
    })

    describe('Minting', () => {
        
        it('creates a new token', async () => {
            const result = await contract.mint('#F1F1F1')
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 1);


            const event = result.logs[0].args;
            assert.equal(event.tokenId.toNumber(), 1, 'id is correct');
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct');
            // assert.equal(event.to, accounts[0], 'to is correct');

            await contract.mint('#F1F1F1').should.be.rejected
        })
    })

    /*describe('Indexing', () => {

        it('lists colors', async () => {
            await contract.mint('#3f3f3f');
            await contract.mint('#ffffff');
            await contract.mint('#000000');
            
            const totalSupply = await contract.totalSupply();
            let result = [];
            for (let i = 1; i <= totalSupply; i++) {
                let color = await contract.colors(i - 1);
                result.push(color);
            }
            let expected = ['#F1F1F1', '#3f3f3f', '#ffffff', '#000000'];
            assert.equals(result.join(','), expected.join(','));
        });
    });*/
})
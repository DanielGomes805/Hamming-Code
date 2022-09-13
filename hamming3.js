const input = require('prompt-sync')({sigint: true});

let bits = [];
let bitsNumber = 0;

function getBits()
{
    bits = [];
    let r = 0;
    bitsNumber = input("Digite a quantidade de bits do grupo original: ");
    
    var number = parseInt(bitsNumber); //Converte para inteiro

    while(number > 2**r-r-1)
    {
        r++;
    } //Calcula a quantidade de bits de redundancia

    console.log(`Número de bits de dados redundantes a serem adicionados: ${r}`);
    console.log(`Total de bits(dados + redundantes): ${number+r}`);

    for(let i = 1; i <= number; i++)
    {
        bits.push(input(`Digite o número ${i}: `));
    }   //Pede a todos os bits de entrada ao usuario

    console.log(`Dados originais: ${bits.join('')}`);

    let redundancyBitsArray = [], totalBits = number+r, hammingCode = [];
    let originalBitIndex = 0;

    for(let i = 0; i < r; i++)
    {
        let indexOfRedundantBits = 2**i;    //2**0 == 1
        redundancyBitsArray.push(indexOfRedundantBits);
    }   //Calcula os indices de redundancy e os armazena em um array

    for(let i = 0; i < totalBits; i++)
    {
        if(redundancyBitsArray.includes(i+1))
        {
            hammingCode[i] = '?';
        }
        else
        {
            hammingCode[i] = bits[originalBitIndex];
            originalBitIndex++;
        }
    }   // ??0?001?001

    for(let j = 0; j < r; j++)
    {
        let position = Math.pow(2, j);
        let parity = 0;
        let s = position -1;    //s = 1 - 1=0

        while(s < totalBits)
        {
            for(let k = s; k < s + position; k++)   //k = 0 k<0+
            {
                if(hammingCode[k] == '1')
                {
                    parity++;
                }
            }
            s = s + 2*position;
        }

        if(parity%2 == 0)
        {
            hammingCode[position-1] = '0';
        }
        else
        {
            hammingCode[position-1] = '1';
        }
    } // Inclue os bits de redundancia

    console.log(`Dados que serão enviados: ${hammingCode.join('')}`);
    
    return hammingCode; 
}

function verifyBits()
{
    let newBitsNumber = input(`Digite a quantidade de bits que foram recebidos:`);
    newBitsNumber = parseInt(newBitsNumber);

    let newBits = [], auxBits = [];

    for(let i = 0; i < newBitsNumber; i++)
    {
        newBits.push(input(`Digite o bit ${i+1}: `));
        auxBits = newBits;
    }

    let i = 1, count, parity, indexOfErrorBit;
    let code = [], controlIndexes = [], redundancyBitsArray = [], reverseIndexPosition = [];

    let reverseBits = newBits.reverse();

    while(reverseBits.length/i >= 1)
    {
        controlIndexes.push(i);
        i *= 2;
    }
    
    for(n = 0; n <= controlIndexes.length-1; n++)
    {
        let position = reverseBits.length - 2**n;
        reverseIndexPosition.push(position);

        if(reverseIndexPosition.includes(position))
        {
            count = 0;
            parity = 0;

            while(position >= 0)
            {
                if(count < 2**n)
                {
                    if(reverseBits[position] == 1) //alterado
                    {
                        parity++;
                    }

                    position--;
                    count++;
                }
                else
                {
                    while(count != 0)
                    {
                        position--;
                        count--;
                    }
                }
            }

            if(parity%2 == 0)
            {
                redundancyBitsArray.push('0');
            }
            else
            {
                redundancyBitsArray.push('1');
            }
        }
    }

    redundancyBitsArray = redundancyBitsArray.reverse();
    indexOfErrorBit = parseInt(redundancyBitsArray.join(""), 2);

    reverseBits.reverse().forEach((element, index) =>
    {
        if(index == indexOfErrorBit)
        {
            if(element == '1')
            {
                reverseBits[index-1] = '0';
            }
            else if(element == '0')
            {
                reverseBits[index-1] = '1';
            }
        }
    }
    )

    for(let index = 0; index < reverseBits.length; index++)
    {
        if(!controlIndexes.includes(index+1))
        {
            code.push(reverseBits[index]);
        }
    }

    if(indexOfErrorBit != 0)
    {
        console.log(`Foi detectado um erro no bit nº ${indexOfErrorBit} do grupo: ${auxBits.join("")}`);

        console.log(`Grupo de bits finais com o bit corrigido: ${code.join("")}`);
    }
    else
    {
        console.log(`Não foi detectado erros no grupo: ${auxBits.join('')}`);
    }
}

function main()
{
    let option;
    do
    {
        console.log("Digite o que você deseja fazer: ");
        console.log("0) SAIR");
        console.log("1) Enviar um grupo de bits");
        console.log("2) Verificar um grupo de bits recebido");

        let optionInput = require('prompt-sync')({sigint: true});
        option = optionInput("Opção: ");

        switch (option)
        {
            case '0':
                console.log("Programa Encerrado");
                break;
            case '1':
                console.log("\n# Caso 1:");
                getBits();
                break;
            case '2':
                console.log("\n# Caso 2:");
                verifyBits();
                break;
            default:
                console.log("Selecione apenas as opções disponíveis!");
        }
    }
    while (option != 0);
}

main();



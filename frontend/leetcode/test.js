let tests = new Map();

tests.set([[2,7,11,15],9],[0,1]);
tests.set([[3,2,4],6],[1,2]);
tests.set([[3,3],6],[0,1]);

function twoSum(target, inputArray){ // two pointer
    let ans = [];
    let l = 0;
    let r = inputArray.length - 1;

    while (l < r){
        console.log(l,r)
        let sum = inputArray[r] + inputArray[l];
        if (sum === target){
            ans.push(l, r);
            console.log(ans)
            break;
        }
        else if (sum > target){
            r--;
        }
        else if (sum < target){
            l++;
        }
    }

    return ans;
}

function isCorrect(answer, correctAnswer){
    if (answer.toString() === correctAnswer.toString()){
        return true;
    }
    return false;
}

tests.forEach((answer, input) => {
    let inputArray = input[0];
    let target = input[1];

    let calcAnswer = twoSum(target, inputArray)

    console.log(isCorrect(calcAnswer, answer));
})

function fib(iterations){
    let current = 0;
    if (current === 0){
        return 0;
    }
    else if (current === 1){
        return 1;
    }
    else if (current === 2){
        return 
    }
}
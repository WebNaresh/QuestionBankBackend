const checkAnswer = (answer, pushIt, teacherAnswer, id, questionSetId, mark) => {
    const findQuestoinSetID = pushIt.questionPaperMarkInfo.find((x) => x.questionPaperSetId == questionSetId);
    let answerCheckUser = answer === teacherAnswer;
    if (findQuestoinSetID) {
        if (answerCheckUser) {
            const attemptedSet = pushIt.questionPaperMarkInfo.find((e) => e.questionPaperSetId == questionSetId);
            const attemptedQuestion = attemptedSet.attempted.find((e) => e == id);
            if (attemptedQuestion) {
                return pushIt;
            } else {
                findQuestoinSetID.mark += mark;
                attemptedSet.attempted.push(id);
                return pushIt;
            }
        } else {
            const nonAttempted = pushIt.questionPaperMarkInfo.find((e) => e.nonAttempted == id);
            if (nonAttempted) {
                return pushIt;
            } else {

                findQuestoinSetID.nonAttempted.push(id);
                return pushIt;
            }
        }

    } else {
        if (answerCheckUser) {
            pushIt.questionPaperMarkInfo.push({ mark, questionPaperSetId: questionSetId });
            return pushIt;
        } else {
            const search1 = pushIt.questionPaperMarkInfo.find((e) => e.questionPaperSetId == questionSetId);
            // const nonAttempted = search1.nonAttempted.find((e) => e == id);
            // console.log(nonAttempted === "undefined");
            if (search1) {
                console.log("12132");
                return pushIt;
                // findQuestoinSetID.nonAttempted.push(id);
            } else {
                pushIt.questionPaperMarkInfo.push({ nonAttempted: id, questionPaperSetId: questionSetId });
                console.log(pushIt);
                return pushIt;
            }
        }
    }
};

module.exports = checkAnswer;
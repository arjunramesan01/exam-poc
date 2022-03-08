
import { React, useState, useEffect } from "react";
import styles from "../styles/exams-index.module.css";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import dynamic from "next/dynamic";
const Popup = dynamic(() => import("reactjs-popup"));
const Link = dynamic(() => import("next/link"));
const Image = dynamic(() => import("next/image"));

const ExamPaper = (props) => {
    props = props.assessmentData;

    const absolutePath = '';
    const assetURL = 'https://search-static.byjusweb.com/assets';
    var [questionsList, setQuestionsList] = useState(props.assessmentData["paperSections"]);
    var [filterSelected, setFilterSelected] = useState(null);
    var [viewSolutionId, setViewSolutionId] = useState(null);
    var [showMarkingAssistPopup, setShowMarkingAssistPopup] = useState(false);
    var [markingAssist, setMarkingAssist] = useState(null);
    var [topicList, setTopicList] = useState([]);
    var [bloomsList, setBloomsList] = useState([]);
    var [typeList, setTypeList] = useState([]);
    const [showLess, setShowLess] = useState(true);

    useEffect(() => {
        var topicList = [];
        var bloomsList = [];
        var typeList = [];
        for (var i = 0; i < questionsList.length; i++) {
        for (var j = 0; j < questionsList[i]["groups"].length; j++) {
            for (
            var k = 0;
            k < questionsList[i]["groups"][j]["questions"].length;
            k++
            ) {
            var el = questionsList[i]["groups"][j]["questions"][k];
            if (
                topicList.includes(el["question"]["matchingRelation"]["topic"]) ==
                false
            ) {
                topicList.push(el["question"]["matchingRelation"]["topic"]);
            }
            if (
                bloomsList.includes(
                bloomsMapping[
                    el["question"]["matchingRelation"]["bloomsIndex"] - 1
                ]
                ) == false
            ) {
                bloomsList.push(
                bloomsMapping[
                    el["question"]["matchingRelation"]["bloomsIndex"] - 1
                ]
                );
            }
            if (typeList.includes(el["question"]["type"]) == false) {
                typeList.push(el["question"]["type"]);
            }
            }
        }
        }
        setTopicList(topicList);
        setBloomsList(bloomsList);
        setTypeList(typeList);

        var temp_questionsList = questionsList;
        temp_questionsList["type"] = "Topic";
        temp_questionsList["all_assesments"] =
        props.assessmentData["all_assesments"];
        temp_questionsList["current_title"] = props.assessmentData["title"];
        setQuestionsList(temp_questionsList);
    }, [props.assessmentData]);

    const alphabet = ["A", "B", "C", "D", "E"];
    const bloomsMapping = [
        "Remember",
        "Understand",
        "Apply",
        "Analyse",
        "Evaluate",
        "Create",
    ];
    const mathjaxConfig = {
        "fast-preview": {
        disabled: true,
        },
        tex2jax: {
        inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
        ],
        displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"],
        ],
        },
        messageStyle: "none",
    };

    function removeSpaces(input, sol = false) {
        var output = input;
        output = output.replace(/&nbsp;/g, " ");
        output = output.replace(/&#xA0;/g, " ");
        output = output.replace("<p>", '<p style="display:inline">');
        if (sol) {
        output = output.replace("<img", '<img loading="lazy" ');
        }
        var re = new RegExp(String.fromCharCode(160), "g");
        output = output.replace(re, " ");
        return output;
    }

    function paperTitleFormatte(inputString) {
        if(!inputString){
            return inputString
        }
        let title = inputString.split("-").slice(0, 5);
        let combinedGradeStandardDate = title.slice(2, 5).join(" ");
        let titleShow = title.slice(0, 2).join(" | ") + " | " + combinedGradeStandardDate;
        var inputArray = inputString.split(" ");
        let mainTitle = inputString.split(",")[0].replaceAll("-", " | ");
        let subTitle = inputString.split(",").slice(1).join(" ");
        return "<b>" + mainTitle + "</b> " + subTitle;
    }

    function showSection(a) {
        if (filterSelected == null || filterSelected == "All") {
        return true;
        }
        for (var i = 0; i < questionsList[a]["groups"].length; i++) {
        for (
            var j = 0;
            j < questionsList[a]["groups"][i]["questions"].length;
            j++
        ) {
            var el = questionsList[a]["groups"][i]["questions"][j];
            if (
            filterSelected == el["question"]["matchingRelation"]["topic"] ||
            bloomsMapping.indexOf(filterSelected) ==
                el["question"]["matchingRelation"]["bloomsIndex"] - 1 ||
            filterSelected == el["question"]["type"]
            ) {
            return true;
            }
        }
        }

        return false;
    }

    function stichComprehensiveAnswersTogether(questions) {
        // returns an text string with new lines at the end of each solution
        let allSolutions = "";
        questions.map((qt, i) => {
        let temp =
            "<div style='margin:1rem 0'>" +
            `<b>Ans ${i + 1}. </b>` +
            qt["question"]["solutionText"] +
            "</div>";
        temp = temp.replace("<p>", '<p style="display:inline">');
        allSolutions += temp;
        });
        return allSolutions;
    }

    return (
        <div className="bodyContainer">
        <div className={styles.searchBarDiv}>
        </div>
        <h2
            className={styles.paperHeader}
            dangerouslySetInnerHTML={{
            __html: paperTitleFormatte(props.assessmentData["title"]),
            }}
        ></h2>
        <div className={styles.breadCrumbs}>
            <span style={{ color: "#773984" }}>
            <Link href={absolutePath + "/question-answer/exams/"}>
                Paper Exams
            </Link>
            </span>
            <span>{" > "}</span>
            <span>
            <Link href={absolutePath + "/question-answer/exams/" + props.assessmentData.query[0]}>
                {props.assessmentData.query[0]}
            </Link>
            </span>
            {" > "}
            <span> {props.assessmentData.query[1]}</span>
        </div>
        {props.assessmentData["instructions"] && (
            <>
            <div className={styles.gi_title}>General Instruction</div>
            <div>
                <div
                className={styles.instructionsDiv}
                dangerouslySetInnerHTML={{
                    __html: showLess
                    ? `${props.assessmentData["instructions"].slice(0, 200)}`
                    : `${props.assessmentData["instructions"]} `,
                }}
                ></div>
                <div
                className={styles.viewSolution}
                style={{
                    display: "inline",
                }}
                >
                <span
                    style={{
                    color: "#773984",
                    cursor: "pointer",
                    }}
                    onClick={() => setShowLess(!showLess)}
                >
                    ...Read {showLess ? "More" : "Less"}
                </span>

                {showLess ? (
                    <span className="myImages">
                    <Image
                        src={assetURL + "/down-vector.png"}
                        width="10"
                        height="10"
                        alt="thumbs-up"
                    ></Image>
                    </span>
                ) : (
                    <span className="myImages">
                    <Image
                        src={assetURL + "/up-vector.png"}
                        width="10"
                        height="10"
                        alt="thumbs-up"
                    ></Image>
                    </span>
                )}
                </div>
            </div>
            <br></br>
            <br></br>
            </>
        )}
        <div className={styles.filterContainer}>
            <div className={styles.filterBox}>
            <div className={styles.filterTab}>
                <select
                id="topics_selector"
                onChange={(e) => {
                    setFilterSelected(e.target.value);
                    document.getElementById("qtype_selector").value = "All";
                    document.getElementById("difficulty_selector").value = "All";
                }}
                >
                <option value={"All"}>Topics</option>
                {topicList.map((el, j) => (
                    <option key={"topic_" + j} value={el}>
                    {el}
                    </option>
                ))}
                </select>
            </div>

            <div className={styles.filterTab}>
                <select
                id="qtype_selector"
                onChange={(e) => {
                    setFilterSelected(e.target.value);
                    document.getElementById("topics_selector").value = "All";
                    document.getElementById("difficulty_selector").value = "All";
                }}
                >
                <option value={"All"}>Question Type</option>
                {typeList.map((el, j) => (
                    <option key={"qtype_" + j} value={el}>
                    {el}
                    </option>
                ))}
                </select>
            </div>

            <div className={styles.filterTab}>
                <select
                id="difficulty_selector"
                onChange={(e) => {
                    setFilterSelected(e.target.value);
                    document.getElementById("qtype_selector").value = "All";
                    document.getElementById("topics_selector").value = "All";
                }}
                >
                <option value={"All"}>Difficulty</option>
                {bloomsList.map((el, j) => (
                    <option key={"difficulty_" + j} value={el}>
                    {el}
                    </option>
                ))}
                </select>
            </div>
            </div>
        </div>

        {questionsList.map((el, a) => (
            <div key={"section_" + a} className={styles.sectionDiv}>
            {el["info"] && showSection(a) && (
                <>
                <div className={styles.sectionTitle}>{el["info"]["name"]}</div>
                <div className={styles.sectionInstructions}>
                    {el["info"]["instructions"]}
                </div>
                </>
            )}
            {el["groups"].map((elT, i) => (
                <div className={styles.groupDiv} key={"group_" + i}>
                {elT["questions"].map((el, j) => (
                    <div key={"elt_" + j} style={{ margin: "2.5rem 0" }}>
                    {
                        <div
                        style={
                            filterSelected == "All" ||
                            filterSelected == null ||
                            filterSelected ==
                            el["question"]["matchingRelation"]["topic"] ||
                            bloomsMapping.indexOf(filterSelected) ==
                            el["question"]["matchingRelation"]["bloomsIndex"] -
                                1 ||
                            filterSelected == el["question"]["type"]
                            ? { display: "block" }
                            : { display: "none" }
                        }
                        >
                        <div className={styles.questionsHolder}>
                            {/* {elT['info']['name'] && <div className={styles.groupTitle}>{elT['info']['name']}</div>} */}
                            {elT["info"]["instructions"] &&
                            elT["info"]["instructions"].length > 12 && (
                                <>
                                <div className={styles.sectionInstructions}>
                                    {elT["info"]["instructions"]}
                                </div>{" "}
                                <br></br>
                                </>
                            )}
                            <div
                            className={styles.questionDiv}
                            key={"question_" + j}
                            >
                            <div
                                dangerouslySetInnerHTML={{
                                __html:
                                    "<b>Q.</b> " +
                                    removeSpaces(el["question"]["text"]),
                                }}
                            ></div>
                            {el["question"]["mcOptions"] && (
                                <>
                                {el["question"]["mcOptions"].map((el, k) => (
                                    <div
                                    className={styles.optionsHolder}
                                    key={"options_" + j + "_" + k}
                                    >
                                    <div className={styles.optionCircle}>
                                        {alphabet[k]}
                                    </div>
                                    <div
                                        dangerouslySetInnerHTML={{
                                        __html: el["value"],
                                        }}
                                    ></div>
                                    </div>
                                ))}
                                </>
                            )}

                            {el["question"]["mtcOptions"]["matching"].length >
                                0 && (
                                <div className={styles.matchTheColumnsDiv}>
                                <div>
                                    {el["question"]["mtcOptions"]["leftColumn"].map(
                                    (el, l) => (
                                        <span
                                        key={"left_" + l}
                                        dangerouslySetInnerHTML={{ __html: el }}
                                        ></span>
                                    )
                                    )}
                                </div>
                                <div>
                                    {el["question"]["mtcOptions"][
                                    "rightColumn"
                                    ].map((el, l) => (
                                    <span
                                        key={"right_" + l}
                                        dangerouslySetInnerHTML={{ __html: el }}
                                    ></span>
                                    ))}
                                </div>
                                </div>
                            )}

                            {el["question"]["type"] == "COMP" &&
                                el["question"]["subQuestions"].length > 0 && (
                                <div
                                    className={
                                    styles.comprehensiveQuestionsContainer
                                    }
                                >
                                    {el["question"]["subQuestions"].map(
                                    (subQt, subQtIndex) => (
                                        <div
                                        className={styles.subQuestionDiv}
                                        key={"subquestion_" + subQtIndex}
                                        >
                                        <div
                                            dangerouslySetInnerHTML={{
                                            __html:
                                                "<b>Q.</b> " +
                                                removeSpaces(
                                                subQt["question"]["text"]
                                                ),
                                            }}
                                        ></div>
                                        {subQt["question"]["mcOptions"] && (
                                            <>
                                            {subQt["question"]["mcOptions"].map(
                                                (subQt, k) => (
                                                <div
                                                    className={styles.optionsHolder}
                                                    key={"options_" + j + "_" + k}
                                                >
                                                    <div
                                                    className={
                                                        styles.optionCircle
                                                    }
                                                    >
                                                    {alphabet[k]}
                                                    </div>
                                                    <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: subQt["value"],
                                                    }}
                                                    ></div>
                                                </div>
                                                )
                                            )}
                                            </>
                                        )}

                                        {subQt["question"]["mtcOptions"][
                                            "matching"
                                        ].length > 0 && (
                                            <div
                                            className={styles.matchTheColumnsDiv}
                                            >
                                            <div>
                                                {subQt["question"]["mtcOptions"][
                                                "leftColumn"
                                                ].map((subQt, l) => (
                                                <span
                                                    key={"left_" + l}
                                                    dangerouslySetInnerHTML={{
                                                    __html: subQt,
                                                    }}
                                                ></span>
                                                ))}
                                            </div>
                                            <div>
                                                {subQt["question"]["mtcOptions"][
                                                "rightColumn"
                                                ].map((subQt, l) => (
                                                <span
                                                    key={"right_" + l}
                                                    dangerouslySetInnerHTML={{
                                                    __html: subQt,
                                                    }}
                                                ></span>
                                                ))}
                                            </div>
                                            </div>
                                        )}
                                        </div>
                                    )
                                    )}
                                </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.questionBottomSection}>
                            {viewSolutionId != a + "_" + i + "_" + j &&
                            (el["question"]["solutionText"] != undefined ||
                                (el["question"]["type"] == "COMP" &&
                                el["question"]["subQuestions"].length > 0)) && (
                                <div
                                className={styles.viewSolution}
                                onClick={() => {
                                    setViewSolutionId(a + "_" + i + "_" + j);
                                }}
                                >
                                <span>View solution</span>
                                <span className="myImages">
                                    <Image
                                    src={assetURL + "/down-vector.png"}
                                    width="10"
                                    height="10"
                                    alt="thumbs-up"
                                    ></Image>
                                </span>
                                </div>
                            )}
                            {viewSolutionId == a + "_" + i + "_" + j &&
                            (el["question"]["solutionText"] != undefined ||
                                (el["question"]["type"] == "COMP" &&
                                el["question"]["subQuestions"].length > 0)) && (
                                <div
                                className={styles.viewSolution}
                                onClick={() => {
                                    setViewSolutionId(null);
                                }}
                                >
                                <span>Hide solution</span>
                                <span className="myImages">
                                    <Image
                                    src={assetURL + "/up-vector.png"}
                                    width="10"
                                    height="10"
                                    alt="thumbs-up"
                                    ></Image>
                                </span>
                                </div>
                            )}
                            <div>
                            {/* {el["question"]["rubrics"][0]["steps"] && (
                                <span
                                className={styles.markingAssist}
                                onClick={() => {
                                    setShowMarkingAssistPopup(true);
                                    setMarkingAssist(
                                    el["question"]["rubrics"][0]["steps"]
                                    );
                                }}
                                >
                                Marking Assist
                                </span>
                            )} */}
                            </div>
                        </div>
                        {/* Non Comprehensive Type */}
                        {viewSolutionId == a + "_" + i + "_" + j &&
                            el["question"]["type"] != "COMP" && (
                            <div className={styles.solutionBox}>
                                <div className={styles.solutionTitle}>Solution</div>
                                <MathJaxContext version={2} config={mathjaxConfig}>
                                <MathJax>
                                    <div
                                    dangerouslySetInnerHTML={{
                                        __html: removeSpaces(
                                        el["question"]["solutionText"],
                                        true
                                        ),
                                    }}
                                    ></div>
                                </MathJax>
                                </MathJaxContext>
                            </div>
                            )}
                        {/* Comprehensive Type */}
                        {viewSolutionId == a + "_" + i + "_" + j &&
                            el["question"]["type"] == "COMP" && (
                            <div className={styles.solutionBox}>
                                <div className={styles.solutionTitle}>Solution</div>
                                <MathJaxContext version={2} config={mathjaxConfig}>
                                <MathJax>
                                    <div
                                    dangerouslySetInnerHTML={{
                                        __html: removeSpaces(
                                        stichComprehensiveAnswersTogether(
                                            el["question"]["subQuestions"]
                                        ),
                                        true
                                        ),
                                    }}
                                    ></div>
                                </MathJax>
                                </MathJaxContext>
                            </div>
                            )}
                        </div>
                    }
                    </div>
                ))}
                </div>
            ))}
            </div>
        ))}
        {showMarkingAssistPopup && (
            <Popup
            open={showMarkingAssistPopup}
            className="marking-assist-popup"
            closeOnDocumentClick
            onClose={() => {
                setShowMarkingAssistPopup(false);
            }}
            >
            <div className={styles.markingAssistContainer}>
                <div className={styles.markingAsssistDiv}>
                <div>
                    <b>Answer</b>
                </div>
                <div>
                    <b>Marks</b>
                </div>
                </div>
                <MathJaxContext version={2} config={mathjaxConfig}>
                <MathJax>
                    {markingAssist &&
                    markingAssist.map((el, i) => (
                        <div key={"ma_" + i} className={styles.markingAsssistDiv}>
                        <div
                            dangerouslySetInnerHTML={{
                            __html: removeSpaces(el["step"], true),
                            }}
                        ></div>
                        <div
                            dangerouslySetInnerHTML={{ __html: el["marks"] }}
                        ></div>
                        </div>
                    ))}
                </MathJax>
                </MathJaxContext>
            </div>
            </Popup>
        )}
        </div>
    );
};

export default ExamPaper;

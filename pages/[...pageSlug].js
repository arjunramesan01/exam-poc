import { props1, props2 } from "../services/contants";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import dynamic from "next/dynamic";
const Head = dynamic(() => import("next/head"));
const Image = dynamic(() => import("next/image"));
const ExamPaper = dynamic(() => import("../components/ExamPaper"));


export async function getServerSideProps(context) {
    var req = context["req"];
    var res = context["res"];
    const query = context.query.pageSlug;
    return {
        props: {
          data: {
            query: query,
          },
        },
      };
}


const PageSlug = ({ data }) => {
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
    return (
      <>
    <Head>
        <title>
          My Questions | Questions &amp; Answers Forum BYJU&lsquo;S - Get All
          Your Academic Doubts Cleared Now!
        </title>
        <meta name="description" content="" />
        <meta name="title" content="Search QnA | My Questions | Byjus" />
        <meta property="og:title" content="Search QnA | My Questions | Byjus" />
        <meta property="og:description" content="" />
        <meta name="robots" content="noindex" />
      </Head>
      <MathJaxContext version={2} config={mathjaxConfig}>
          <MathJax>
            <ExamPaper assessmentData={data.query.includes('science') ? props1 : props2}></ExamPaper>
          </MathJax>
      </MathJaxContext>
      </>
    )
};


export default PageSlug;

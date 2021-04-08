// import "./contest.css";
import Container from "@material-ui/core/Container";
export const Testdata = () => {
  return (
    <Container>
      <div>
        <span>
          <span className="lang-ja">
            <p>
              配点 : <var>100</var> 点
            </p>

            <div className="part">
              <section>
                <h3>問題文</h3>
                <p>
                  長さ <var>3</var> の文字列 <var>S</var> が与えられます。
                  <br />
                  <var>S</var> の先頭の文字を
                  <var>S</var> の末尾に移動して得られる文字列
                  <var>S'</var> を出力してください。
                </p>
              </section>
            </div>

            <div className="part">
              <section>
                <h3>制約</h3>
                <ul>
                  <li>
                    <var>S</var> は英小文字のみからなる長さ
                    <var>3</var> の文字列である
                  </li>
                </ul>
              </section>
            </div>

            <hr />
            <div className="io-style">
              <div className="part">
                <section>
                  <h3>入力</h3>
                  <p>入力は以下の形式で標準入力から与えられる。</p>
                  <pre>
                    <var>S</var>
                  </pre>
                </section>
              </div>

              <div className="part">
                <section>
                  <h3>出力</h3>
                  <p>
                    <var>S'</var> を出力せよ。
                  </p>
                </section>
              </div>
            </div>

            <hr />
            <div className="part">
              <section>
                <h3>入力例 1</h3>
                <pre>abc</pre>
              </section>
            </div>

            <div className="part">
              <section>
                <h3>出力例 1</h3>
                <pre>bca</pre>
                <p>
                  <code>abc</code> の先頭の文字 <code>a</code>{" "}
                  を末尾に移動すると
                  <code>bca</code> となります。
                </p>
              </section>
            </div>

            <hr />
            <div className="part">
              <section>
                <h3>入力例 2</h3>
                <pre>aab</pre>
              </section>
            </div>

            <div className="part">
              <section>
                <h3>出力例 2</h3>
                <pre>aba</pre>
              </section>
            </div>
          </span>
          <span className="lang-en">
            <p>
              Score : <var>100</var> points
            </p>

            <div className="part">
              <section>
                <h3>Problem Statement</h3>
                <p>
                  Given is a string <var>S</var> of length <var>3</var>.<br />
                  Move the first character of <var>S</var> to the end of
                  <var>S</var> and print the resulting string <var>S'</var>.
                </p>
              </section>
            </div>

            <div className="part">
              <section>
                <h3>Constraints</h3>
                <ul>
                  <li>
                    <var>S</var> is a string of length <var>3</var> consisting
                    of lowercase English letters.
                  </li>
                </ul>
              </section>
            </div>

            <hr />
            <div className="io-style">
              <div className="part">
                <section>
                  <h3>Input</h3>
                  <p>
                    Input is given from Standard Input in the following format:
                  </p>
                  <pre>
                    <var>S</var>
                  </pre>
                </section>
              </div>

              <div className="part">
                <section>
                  <h3>Output</h3>
                  <p>
                    Print <var>S'</var>.
                  </p>
                </section>
              </div>
            </div>

            <hr />
            <div className="part">
              <section>
                <h3>Sample Input 1</h3>
                <pre>abc</pre>
              </section>
            </div>

            <div className="part">
              <section>
                <h3>Sample Output 1</h3>
                <pre>bca</pre>
                <p>
                  Moving the first character <code>a</code> of the string
                  <code>abc</code> results in <code>bca</code>.
                </p>
              </section>
            </div>

            <hr />
            <div className="part">
              <section>
                <h3>Sample Input 2</h3>
                <pre>aab</pre>
              </section>
            </div>

            <div className="part">
              <section>
                <h3>Sample Output 2</h3>
                <pre>aba</pre>
              </section>
            </div>
          </span>
        </span>
      </div>
    </Container>
  );
};

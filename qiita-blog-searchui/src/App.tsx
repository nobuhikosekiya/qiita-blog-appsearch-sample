import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import React from "react";
import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  WithSearch,
  Sorting
} from "@elastic/react-search-ui";
import {
  BooleanFacet,
  Layout,
  SingleLinksFacet,
  SingleSelectFacet
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import { SearchDriverOptions } from "@elastic/search-ui";
const connector = new AppSearchAPIConnector({
  searchKey: "search-t54z6i28cphvuzazew5rcree",
  engineName: "qiita-blog-appsearch-engine",
  endpointBase: "https://nobu-genai-docs.ent.ap-northeast-1.aws.found.io"
});
const config: SearchDriverOptions = {
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    // result_fields: {
    //   title: { raw: {} }
    // },
    // search_fields: {},
    disjunctiveFacets: ["created_at", "tags"],
    facets: {
      created_at: {
        type: "range",
        ranges: [
          {
            from: '2023-01-01T00:00:00.000Z',
            to: '2023-12-31T00:00:00.000Z',
            name: "2023年"
          },
          {
            from: '2022-01-01T00:00:00.000Z',
            to: '2022-12-31T00:00:00.000Z',
            name: "2022年"
          },
          {
            to: '2021-12-31T00:00:00.000Z',
            name: "2021年以前"
          }
        ]
      },
      tags: {
        type: "value"
      }
    }
  }
};

const SORT_OPTIONS = [
  {
    name: "関連度",
    value: []
  },
  {
    name: "作成日",
    value: [
      {
        field: "created_at",
        direction: "desc"
      }
    ]
  }
]

const CustomResultView = ({ result, onClickLink }: any) => (
  <li className="sui-result">
    <div className="sui-result__header">
      <h3>
        {/* Maintain onClickLink to correct track click throughs for analytics*/}
        <a onClick={onClickLink} href={result.url.raw}>
          {result.title.raw}
        </a>
      </h3>
    </div>
    <div className="sui-result__body">
      {/* Use the 'snippet' property of fields with dangerouslySetInnerHtml to render snippets */}
      <div
        className="sui-result__details"
        dangerouslySetInnerHTML={{ __html: result.body.snippet }}
      ></div>
    </div>
    <div className="sui-layout-main-footer2">
      作成日:{result.created_at.raw} タグ:{result.tags.raw.join(", ")}
    </div>
  </li>
);

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ wasSearched }) => ({
          wasSearched
        })}
      >
        {({ wasSearched }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={<SearchBox debounceLength={0} />}
                  sideContent={<div>
                    <Sorting label={"Sort by"} sortOptions={SORT_OPTIONS} />
                    <Facet
                      field="created_at"
                      label="作成日"
                      filterType="any"
                    />
                    <Facet
                      field="tags"
                      label="タグ"
                      filterType="any"
                    />
                  </div>}
                  bodyContent={
                    <Results
                      titleField="title"
                      urlField="url"
                      // thumbnailField="image_url"
                      shouldTrackClickThrough
                      resultView={CustomResultView}
                    />
                  }
                  bodyHeader={
                    <React.Fragment>
                      {wasSearched && <PagingInfo />}
                      {wasSearched && <ResultsPerPage />}
                    </React.Fragment>
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
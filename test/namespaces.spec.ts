import { describe, it, expect } from 'vitest';
import { parseXML } from '../lib/index.ts';

const ooxml = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>

<styleSheet
  mc:Ignorable="x14ac"
  xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"
>
  <font x14ac:knownFont="1">
    <name val="Aptos Narrow"/>
  </font>

  <extLst>
    <ext xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main">
      <x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/>
    </ext>
    <ext xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">
      <x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/>
    </ext>
  </extLst>
</styleSheet>
`;

describe('namespace validation', () => {
  it('simple tag', () => {
    const doc = parseXML(ooxml, { ns: true });
    expect(doc.namespaces.list()).toStrictEqual([
      [ 'http://schemas.openxmlformats.org/spreadsheetml/2006/main', '' ],
      [ 'http://schemas.openxmlformats.org/markup-compatibility/2006', 'mc' ],
      [ 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac', 'x14ac' ],
      [ 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main', 'x14' ],
      [ 'http://schemas.microsoft.com/office/spreadsheetml/2010/11/main', 'x15' ]
    ]);
  });
});

// test:
// - missing decl
// - decl collisions (reused prefix)
// - decl collisions (reused uri)

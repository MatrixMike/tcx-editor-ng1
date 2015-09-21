Garmin .tcx GPS file editor
=======================

MEAN application to decode, display and provide limited editing of Garmin biking GSP data (.tcx format).

**Notes:**
    - Original .fit files need to be uploaded to Garmin Connect and then exported as .tcx files
    - Impact of the updated summary data (see below) will depend on whether/how applications use this data

Known bugs
  - can only multi-select within a lap
  - can only re-base distances following deletions from first lap


.tcx File format, from a Garmin Edge 800

```
<TrainingCenterDatabase ...>
  <Activities>
    <Activity Sport="Biking">
      <Id>**Updated by app**</Id>
      <Lap StartTime="**Updated by app**">
        <TotalTimeSeconds>**Updated by app**</TotalTimeSeconds>                        **Recorded to 3 decimal places**
        <DistanceMeters>**Updated by app**</DistanceMeters>
        <MaximumSpeed>1.531999</MaximumSpeed>
        <Calories>15</Calories>
        <Intensity>Active</Intensity>
        <TriggerMethod>Manual</TriggerMethod>
        <Track>  **Updated by app**
          <Trackpoint>
            <Time>2015-01-01T11:49:09.000Z</Time>                                       **Recorded, effectively, to 0 decimal places**
            <Position>
              <LatitudeDegrees>-120.844</LatitudeDegrees>
              <LongitudeDegrees>14.9435</LongitudeDegrees>
            </Position>
            <AltitudeMeters>0.0</AltitudeMeters>
            <DistanceMeters>1.009999</DistanceMeters>
            <Extensions>
              <TPX xmlns="http://www.garmin.com/xmlschemas/ActivityExtension/v2">
                <Speed>0.9139999747276306</Speed>                                     **Not included in latest tcx from Connect**
              </TPX>
            </Extensions>
          </Trackpoint>
          ...
        </Track>
        <Extensions>
          <LX xmlns="http://www.garmin.com/xmlschemas/ActivityExtension/v2">
            <AvgSpeed>**Updated by app**</AvgSpeed>
          </LX>
        </Extensions>
      </Lap>
      ...

```
In brief:

- Activities contains one Activity
- An Activity contains Laps
- Each Lap has some meta info and a Track
- A Track comprises an array of Trackpoints
- Each Trackpoint has a speed, location and accumulated distance

### Change log
- 14 Sep 15 - 2.0.0: rewrite in ES6
- 24 Jan 15 - 1.3.0: &lt;shift&gt;+click functionality improved; fixed bug when deleting entire lap
- 31 Jan 15 - 1.2.1: fixed bug when deleting last lap
- &nbsp;2 Feb 15 - 1.2.0: Use colours to distinguish laps, highlight rows where speed = 0
- 29 Jun 14 - 1.1.0: Handles delete from start correctly; fixed potential crashes

### Todo
- Error messages for badly formatted files
- Provide option to change ride time (and avg speed) to time spent moving (i.e. dropping lunch stops where GPS left on)
- Show total distance for info
